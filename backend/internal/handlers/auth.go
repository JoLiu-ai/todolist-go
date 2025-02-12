package handlers

import (
	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	jwtSecret string
	repo      *repository.AuthRepository
}

func NewAuthHandler(jwtSecret string, repo *repository.AuthRepository) *AuthHandler {
	return &AuthHandler{
		jwtSecret: jwtSecret,
		repo:      repo,
	}
}

// Register 用户注册
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if strings.Contains(err.Error(), "Password") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "密码长度至少需要6个字符"})
		} else if strings.Contains(err.Error(), "Email") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请输入有效的邮箱地址"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请检查输入格式是否正确"})
		}
		return
	}

	// 检查邮箱是否已存在
	_, err := h.repo.GetUserByEmail(c.Request.Context(), req.Email)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "该邮箱已被注册"})
		return
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "密码加密失败，请重试"})
		return
	}

	// 如果没有提供用户名，使用邮箱的用户名部分
	var username string
	if req.Username != nil && *req.Username != "" {
		username = *req.Username
	} else {
		username = req.Email[:strings.Index(req.Email, "@")]
	}
	fmt.Printf("Using username: %s (from email: %s)\n", username, req.Email)

	// 创建用户
	user := &models.User{
		Email:    req.Email,
		Username: &username,
		Password: string(hashedPassword),
	}

	if err := h.repo.CreateUser(c.Request.Context(), user); err != nil {
		fmt.Printf("Error creating user: %v\n", err)
		if strings.Contains(err.Error(), "duplicate key") {
			if strings.Contains(err.Error(), "username") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "该用户名已被使用"})
			} else if strings.Contains(err.Error(), "email") {
				c.JSON(http.StatusBadRequest, gin.H{"error": "该邮箱已被注册"})
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "该用户信息已存在"})
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "创建用户失败，请重试"})
		}
		return
	}

	fmt.Printf("Successfully created user: ID=%d, Email=%s, Username=%s\n", user.ID, user.Email, *user.Username)

	// 生成 JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		fmt.Printf("Error generating token: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "生成登录令牌失败，请重新登录"})
		return
	}

	fmt.Printf("Generated token for user %d\n", user.ID)

	c.JSON(http.StatusOK, models.LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

// Login 用户登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		if strings.Contains(err.Error(), "Username") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请输入用户名或邮箱"})
		} else if strings.Contains(err.Error(), "Password") {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请输入密码"})
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "请检查输入信息是否完整"})
		}
		return
	}

	fmt.Printf("Login attempt with username/email: %s\n", req.Username)

	// 尝试通过用户名获取用户
	user, err := h.repo.GetUserByUsername(c.Request.Context(), req.Username)
	if err != nil {
		fmt.Printf("Failed to find user by username %s: %v\n", req.Username, err)
		// 如果用户名不存在，尝试通过邮箱获取用户
		user, err = h.repo.GetUserByEmail(c.Request.Context(), req.Username)
		if err != nil {
			fmt.Printf("Failed to find user by email %s: %v\n", req.Username, err)
			if strings.Contains(err.Error(), "record not found") {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "用户名或邮箱不存在"})
			} else {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "登录失败，请稍后重试"})
			}
			return
		}
	}

	fmt.Printf("Found user: ID=%d, Email=%s, Username=%s\n", user.ID, user.Email, *user.Username)

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		fmt.Printf("Password verification failed for user %d\n", user.ID)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "密码错误"})
		return
	}

	fmt.Printf("Password verified for user %d\n", user.ID)

	// 生成 JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		fmt.Printf("Error generating token: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "登录失败，请重试"})
		return
	}

	fmt.Printf("Login successful for user %d\n", user.ID)

	c.JSON(http.StatusOK, models.LoginResponse{
		Token: tokenString,
		User:  user,
	})
}

// GetProfile 获取用户信息
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID := c.GetInt("userID")
	user, err := h.repo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateProfile 更新用户信息
func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID := c.GetInt("userID")
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 不允许更新某些字段
	delete(updates, "id")
	delete(updates, "password")

	if err := h.repo.UpdateUser(c.Request.Context(), userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}

	user, err := h.repo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// ChangePassword 修改密码
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID := c.GetInt("userID")
	var req struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.repo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// 验证旧密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid old password"})
		return
	}

	// 加密新密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// 更新密码
	if err := h.repo.UpdatePassword(c.Request.Context(), userID, string(hashedPassword)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

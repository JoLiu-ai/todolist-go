package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		fmt.Println("\n=== AuthMiddleware Start ===")
		fmt.Printf("Request Path: %s %s\n", c.Request.Method, c.Request.URL.Path)

		authHeader := c.GetHeader("Authorization")
		fmt.Printf("Authorization Header: %s\n", authHeader)

		if authHeader == "" {
			fmt.Println("Missing Authorization header")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			fmt.Println("Invalid authorization header format")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims := jwt.MapClaims{}

		// 从环境变量获取JWT secret
		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			jwtSecret = "your-jwt-secret" // 默认值
			fmt.Println("Using default JWT secret")
		}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil {
			fmt.Printf("Token parsing error: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		if !token.Valid {
			fmt.Println("Token is invalid")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		fmt.Printf("Token claims: %+v\n", claims)

		// 将用户信息存储在上下文中
		if userIDFloat, ok := claims["user_id"].(float64); ok {
			userID := int(userIDFloat)
			fmt.Printf("User ID from token: %d\n", userID)
			if userID == 0 {
				fmt.Println("User ID is 0")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: user_id cannot be 0"})
				c.Abort()
				return
			}
			c.Set("userID", userID)
		} else {
			fmt.Printf("Failed to get user_id from claims, type: %T, value: %v\n", claims["user_id"], claims["user_id"])
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: missing or invalid user_id"})
			c.Abort()
			return
		}

		if username, ok := claims["username"].(string); ok {
			fmt.Printf("Username from token: %s\n", username)
			c.Set("username", username)
		}

		fmt.Println("=== AuthMiddleware End ===")
		c.Next()
	}
}

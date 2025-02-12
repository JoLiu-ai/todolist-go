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
		fmt.Println("=== AuthMiddleware called ===")
		authHeader := c.GetHeader("Authorization")
		fmt.Printf("Authorization header: %s\n", authHeader)
		if authHeader == "" {
			fmt.Println("Missing Authorization header")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Bearer token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			fmt.Printf("Invalid Authorization header format: %s\n", authHeader)
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
		}

		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})

		if err != nil || !token.Valid {
			fmt.Printf("Token validation error: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		fmt.Printf("Token claims: %+v\n", claims)

		// 将用户信息存储在上下文中
		if userIDFloat, ok := claims["user_id"].(float64); ok {
			userID := uint(userIDFloat)
			fmt.Printf("Converting user_id from float64 (%v) to uint (%v)\n", userIDFloat, userID)
			if userID == 0 {
				fmt.Printf("Warning: user_id is 0 after conversion\n")
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: user_id cannot be 0"})
				c.Abort()
				return
			}
			c.Set("user_id", userID)
		} else {
			fmt.Printf("Failed to get user_id from claims. Type: %T, Value: %v\n", claims["user_id"], claims["user_id"])
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token: missing or invalid user_id"})
			c.Abort()
			return
		}

		if username, ok := claims["username"].(string); ok {
			fmt.Printf("Setting username in context: %s\n", username)
			c.Set("username", username)
		}

		c.Next()
	}
}

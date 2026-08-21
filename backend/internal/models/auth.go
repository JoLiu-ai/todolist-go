package models

// LoginRequest 是登录接口的请求体，支持用户名或邮箱登录。
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// RegisterRequest 是注册接口的请求体，用户名可选（缺省时取邮箱前缀）。
type RegisterRequest struct {
	Email    string  `json:"email" binding:"required,email"`
	Password string  `json:"password" binding:"required,min=6"`
	Username *string `json:"username"`
}

// LoginResponse 是登录/注册成功后返回的令牌与用户信息。
type LoginResponse struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

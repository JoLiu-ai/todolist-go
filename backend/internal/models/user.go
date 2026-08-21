package models

import "time"

// User 对应数据库 users 表，代表一个注册用户。
type User struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Username  *string   `json:"username" gorm:"column:username;unique"`
	Email     string    `json:"email" gorm:"column:email;not null;unique"`
	Password  string    `json:"-" gorm:"column:password;not null"` // 仅存哈希，永不序列化返回
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt time.Time `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名，避免 GORM 复数化推断出错。
func (User) TableName() string { return "users" }

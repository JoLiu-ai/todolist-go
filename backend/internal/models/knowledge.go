package models

import (
	"time"

	"github.com/lib/pq"
)

// Knowledge 对应数据库 knowledge 表，代表一条知识/笔记条目。
type Knowledge struct {
	ID        int            `json:"id" gorm:"primaryKey"`
	Title     string         `json:"title" gorm:"column:title;not null"`
	Content   string         `json:"content" gorm:"column:content;not null"`
	Type      string         `json:"type" gorm:"column:type;default:note"`
	Category  string         `json:"category" gorm:"column:category;default:other"`
	Tags      pq.StringArray `json:"tags" gorm:"column:tags;type:text[]"`
	UserID    int            `json:"user_id" gorm:"column:user_id;not null"`
	CreatedAt time.Time      `json:"created_at" gorm:"column:created_at"`
	UpdatedAt time.Time      `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名，避免复数化把 knowledge 变成 knowledges。
func (Knowledge) TableName() string { return "knowledge" }

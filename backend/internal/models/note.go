package models

import "time"

// Note 对应数据库 notes 表，是挂在某条媒体下的读书/观影笔记。
type Note struct {
	ID        int       `json:"id" gorm:"primaryKey"`
	Content   string    `json:"content" gorm:"column:content;not null"`
	Page      *int      `json:"page" gorm:"column:page"`
	MediaID   int       `json:"media_id" gorm:"column:media_id;not null"`
	CreatedAt time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt time.Time `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名。
func (Note) TableName() string { return "notes" }

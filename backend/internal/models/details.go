package models

import (
	"time"

	"github.com/lib/pq"
)

// BookDetails 对应数据库 book_details 表，保存书籍的扩展信息。
type BookDetails struct {
	ID          int        `json:"id" gorm:"primaryKey"`
	MediaID     int        `json:"media_id" gorm:"column:media_id;not null"`
	ISBN        string     `json:"isbn" gorm:"column:isbn"`
	Author      string     `json:"author" gorm:"column:author"`
	Publisher   string     `json:"publisher" gorm:"column:publisher"`
	PublishDate *time.Time `json:"publish_date" gorm:"column:publish_date"`
	Pages       int        `json:"pages" gorm:"column:pages"`
	Language    string     `json:"language" gorm:"column:language"`
	CreatedAt   time.Time  `json:"created_at" gorm:"column:created_at"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名。
func (BookDetails) TableName() string { return "book_details" }

// MovieDetails 对应数据库 movie_details 表，保存电影的扩展信息。
type MovieDetails struct {
	ID          int            `json:"id" gorm:"primaryKey"`
	MediaID     int            `json:"media_id" gorm:"column:media_id;not null"`
	Director    string         `json:"director" gorm:"column:director"`
	CastMembers pq.StringArray `json:"cast_members" gorm:"column:cast_members;type:text[]"`
	ReleaseDate *time.Time     `json:"release_date" gorm:"column:release_date"`
	Duration    int            `json:"duration" gorm:"column:duration"`
	Language    string         `json:"language" gorm:"column:language"`
	Country     string         `json:"country" gorm:"column:country"`
	CreatedAt   time.Time      `json:"created_at" gorm:"column:created_at"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名。
func (MovieDetails) TableName() string { return "movie_details" }

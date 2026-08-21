package models

import (
	"time"

	"github.com/lib/pq"
)

// 媒体类型常量。
const (
	MediaTypeBook  = "book"
	MediaTypeMovie = "movie"
)

// 媒体状态常量，取值与前端 MediaStatus 保持一致。
const (
	StatusInProgress = "in_progress"
	StatusCompleted  = "completed"
	StatusPlanToRead = "plan_to_read"
	StatusDropped    = "dropped"
)

// Media 对应数据库 media 表，书籍与电影共用此表，通过 Type 区分。
type Media struct {
	ID          int            `json:"id" gorm:"primaryKey"`
	Type        string         `json:"type" gorm:"column:type;not null"`
	Title       string         `json:"title" gorm:"column:title;not null"`
	Description string         `json:"description" gorm:"column:description"`
	Creator     string         `json:"creator" gorm:"column:creator"`
	CoverImage  string         `json:"cover_image" gorm:"column:cover_image"`
	Status      string         `json:"status" gorm:"column:status;default:plan_to_read"`
	Rating      float64        `json:"rating" gorm:"column:rating;default:0"`
	Tags        pq.StringArray `json:"tags" gorm:"column:tags;type:text[]"`
	Progress    int            `json:"progress" gorm:"column:progress;default:0"`
	UserID      int            `json:"user_id" gorm:"column:user_id;not null"`
	CreatedAt   time.Time      `json:"created_at" gorm:"column:created_at"`
	UpdatedAt   time.Time      `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名，避免复数化把 media 变成 medias。
func (Media) TableName() string { return "media" }

// MediaFilter 承载媒体列表查询的过滤、排序与分页条件。
// 指针字段表示“未提供”，从而与零值区分。
type MediaFilter struct {
	Type     *string
	Status   *string
	Title    *string
	Creator  *string
	Rating   *float32
	Tags     []string
	UserID   *int
	SortBy   string
	SortDesc bool
	Page     int
	PageSize int
}

// MediaStats 汇总某个用户的媒体统计，用于首页展示。
type MediaStats struct {
	TotalBooks     int64 `json:"total_books"`
	ReadingBooks   int64 `json:"reading_books"`
	TotalMovies    int64 `json:"total_movies"`
	WatchingMovies int64 `json:"watching_movies"`
}

// HomeData 聚合首页所需的多组媒体列表。
type HomeData struct {
	LatestBooks    []Media `json:"latest_books"`
	LatestMovies   []Media `json:"latest_movies"`
	TopRatedBooks  []Media `json:"top_rated_books"`
	TopRatedMovies []Media `json:"top_rated_movies"`
}

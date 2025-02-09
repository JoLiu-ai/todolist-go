package domain

import (
	"time"

	"github.com/lib/pq"
)

// MediaType 定义了媒体类型
type MediaType string

const (
	MediaTypeBook  MediaType = "book"
	MediaTypeVideo MediaType = "video"
)

// MediaStatus 定义了媒体状态
type MediaStatus string

const (
	MediaStatusWishlist MediaStatus = "wishlist" // 想看/想读
	MediaStatusReading  MediaStatus = "reading"  // 在看/在读
	MediaStatusDone     MediaStatus = "done"     // 已看/已读
)

// Media 表示一个媒体项目（书籍或电影）
type Media struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	UserID       uint           `json:"user_id" gorm:"not null"` // 所属用户ID
	Type         MediaType      `json:"type" gorm:"not null"`    // book/movie
	DisplayName  Name           `json:"display_name" gorm:"embedded;embeddedPrefix:display_name_"`
	OriginalName *Name          `json:"original_name,omitempty" gorm:"embedded;embeddedPrefix:original_name_"`
	Description  *Text          `json:"description,omitempty" gorm:"embedded;embeddedPrefix:description_"`
	Creator      *string        `json:"creator,omitempty"`                         // 作者/导演（可选）
	Cover        string         `json:"cover,omitempty"`                           // 封面图片URL
	ResourceLink string         `json:"resource_link,omitempty"`                   // 资源链接
	Status       MediaStatus    `json:"status" gorm:"not null;default:'wishlist'"` // 状态
	Rating       float32        `json:"rating" gorm:"default:0"`                   // 评分 (0-5)
	Comment      *Text          `json:"comment,omitempty" gorm:"embedded;embeddedPrefix:comment_"`
	StartDate    *time.Time     `json:"start_date,omitempty"`              // 开始时间
	FinishDate   *time.Time     `json:"finish_date,omitempty"`             // 完成时间
	Tags         pq.StringArray `json:"tags,omitempty" gorm:"type:text[]"` // 标签
	CategoryID   uint           `json:"category_id"`
	Category     *Category      `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Notes        []*Note        `json:"notes,omitempty" gorm:"foreignKey:MediaID"`         // 笔记列表
	BookDetails  *BookDetails   `json:"book_details,omitempty" gorm:"foreignKey:MediaID"`  // 书籍详情
	MovieDetails *MovieDetails  `json:"movie_details,omitempty" gorm:"foreignKey:MediaID"` // 电影详情
	CreatedAt    time.Time      `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt    time.Time      `json:"updated_at" gorm:"autoUpdateTime"`
}

// Name 表示双语名称
type Name struct {
	Primary   string  `json:"primary" gorm:"not null"`
	Secondary *string `json:"secondary,omitempty"`
}

// Text 表示双语文本
type Text struct {
	Primary   string  `json:"primary,omitempty"`
	Secondary *string `json:"secondary,omitempty"`
}

// Book 特有的属性
type BookDetails struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	MediaID     uint       `json:"media_id" gorm:"not null"`
	ISBN        string     `json:"isbn"`                          // ISBN
	Publisher   string     `json:"publisher"`                     // 出版社
	PublishDate *time.Time `json:"publish_date,omitempty"`        // 出版日期
	Pages       int        `json:"pages"`                         // 页数
	CurrentPage int        `json:"current_page" gorm:"default:0"` // 当前页数
}

// Movie 特有的属性
type MovieDetails struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	MediaID     uint       `json:"media_id" gorm:"not null"`
	Duration    int        `json:"duration"`               // 时长（分钟）
	ReleaseDate *time.Time `json:"release_date,omitempty"` // 上映日期
	Country     string     `json:"country"`                // 国家/地区
	Language    string     `json:"language"`               // 语言
}

// NewBook 创建一个新的书籍
func NewBook(displayName Name, author *string) *Media {
	return &Media{
		Type:        MediaTypeBook,
		DisplayName: displayName,
		Creator:     author,
		Status:      MediaStatusWishlist,
	}
}

// NewMovie 创建一个新的电影
func NewMovie(displayName Name, director *string) *Media {
	return &Media{
		Type:        MediaTypeVideo,
		DisplayName: displayName,
		Creator:     director,
		Status:      MediaStatusWishlist,
	}
}

// UpdateStatus 更新媒体状态
func (m *Media) UpdateStatus(status MediaStatus) {
	m.Status = status
	now := time.Now()

	switch status {
	case MediaStatusReading:
		if m.StartDate == nil {
			m.StartDate = &now
		}
	case MediaStatusDone:
		if m.FinishDate == nil {
			m.FinishDate = &now
		}
	}
}

// AddTag 添加标签
func (m *Media) AddTag(tag string) {
	// 检查标签是否已存在
	for _, t := range m.Tags {
		if t == tag {
			return
		}
	}
	m.Tags = append(m.Tags, tag)
}

// RemoveTag 移除标签
func (m *Media) RemoveTag(tag string) {
	for i, t := range m.Tags {
		if t == tag {
			m.Tags = append(m.Tags[:i], m.Tags[i+1:]...)
			return
		}
	}
}

// UpdateRating 更新评分
func (m *Media) UpdateRating(rating float32) {
	if rating >= 0 && rating <= 5 {
		m.Rating = rating
	}
}

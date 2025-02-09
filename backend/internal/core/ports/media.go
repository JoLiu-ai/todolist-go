package ports

import (
	"context"

	"cute-todo/backend/internal/core/domain"
)

// MediaFilter 定义了媒体查询过滤条件
type MediaFilter struct {
	Type     *domain.MediaType   `json:"type,omitempty"`
	Status   *domain.MediaStatus `json:"status,omitempty"`
	Title    *string             `json:"title,omitempty"`
	Creator  *string             `json:"creator,omitempty"`
	Rating   *float32            `json:"rating,omitempty"`
	Tags     []string            `json:"tags,omitempty"`
	UserID   *uint               `json:"user_id,omitempty"`
	Page     int                 `json:"page"`
	PageSize int                 `json:"page_size"`
	SortBy   string              `json:"sort_by"`
	SortDesc bool                `json:"sort_desc"`
}

// MediaService 定义了媒体服务的接口
type MediaService interface {
	// 基础 CRUD 操作
	Create(ctx context.Context, media *domain.Media) error
	GetByID(ctx context.Context, id uint) (*domain.Media, error)
	Update(ctx context.Context, media *domain.Media) error
	Delete(ctx context.Context, id uint) error

	// 查询操作
	List(ctx context.Context, filter MediaFilter) ([]*domain.Media, error)
	Count(ctx context.Context, filter MediaFilter) (int64, error)

	// 笔记操作
	GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error)
	CountNotes(ctx context.Context, mediaID uint) (int64, error)
	AddNote(ctx context.Context, mediaID uint, note *domain.Note) error
	UpdateNote(ctx context.Context, mediaID uint, note *domain.Note) error
	DeleteNote(ctx context.Context, mediaID, noteID uint) error
}

// MediaRepository 定义了媒体存储的接口
type MediaRepository interface {
	// 基础 CRUD 操作
	Create(ctx context.Context, media *domain.Media) error
	GetByID(ctx context.Context, id uint) (*domain.Media, error)
	Update(ctx context.Context, media *domain.Media) error
	Delete(ctx context.Context, id uint) error

	// 查询操作
	List(ctx context.Context, filter MediaFilter) ([]*domain.Media, error)
	Count(ctx context.Context, filter MediaFilter) (int64, error)

	// 笔记操作
	GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error)
	CountNotes(ctx context.Context, mediaID uint) (int64, error)
	CreateNote(ctx context.Context, mediaID uint, note *domain.Note) error
	UpdateNote(ctx context.Context, mediaID uint, note *domain.Note) error
	DeleteNote(ctx context.Context, mediaID, noteID uint) error

	// 书籍详情操作
	CreateBookDetails(ctx context.Context, details *domain.BookDetails) error
	GetBookDetails(ctx context.Context, mediaID uint) (*domain.BookDetails, error)
	UpdateBookDetails(ctx context.Context, details *domain.BookDetails) error

	// 电影详情操作
	CreateMovieDetails(ctx context.Context, details *domain.MovieDetails) error
	GetMovieDetails(ctx context.Context, mediaID uint) (*domain.MovieDetails, error)
	UpdateMovieDetails(ctx context.Context, details *domain.MovieDetails) error
}

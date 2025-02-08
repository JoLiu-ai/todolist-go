package ports

import (
	"context"

	"cute-todo/backend/internal/core/domain"
)

// MediaRepository 定义了媒体仓储接口
type MediaRepository interface {
	// 基础 CRUD 操作
	Create(ctx context.Context, media *domain.Media) error
	GetByID(ctx context.Context, id uint) (*domain.Media, error)
	Update(ctx context.Context, media *domain.Media) error
	Delete(ctx context.Context, id uint) error

	// 查询操作
	List(ctx context.Context, filter MediaFilter) ([]*domain.Media, error)
	Count(ctx context.Context, filter MediaFilter) (int64, error)

	// 书籍特有操作
	CreateBookDetails(ctx context.Context, details *domain.BookDetails) error
	GetBookDetails(ctx context.Context, mediaID uint) (*domain.BookDetails, error)
	UpdateBookDetails(ctx context.Context, details *domain.BookDetails) error

	// 电影特有操作
	CreateMovieDetails(ctx context.Context, details *domain.MovieDetails) error
	GetMovieDetails(ctx context.Context, mediaID uint) (*domain.MovieDetails, error)
	UpdateMovieDetails(ctx context.Context, details *domain.MovieDetails) error

	// 笔记操作
	GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error)
	CountNotes(ctx context.Context, mediaID uint) (int64, error)
	CreateNote(ctx context.Context, note *domain.Note) error
	UpdateNote(ctx context.Context, note *domain.Note) error
	DeleteNote(ctx context.Context, mediaID uint, noteID uint) error
}

// MediaFilter 定义了媒体查询过滤条件
type MediaFilter struct {
	Type     *domain.MediaType   // 媒体类型
	Status   *domain.MediaStatus // 状态
	Title    *string             // 标题（模糊匹配）
	Creator  *string             // 作者/导演（模糊匹配）
	Tags     []string            // 标签
	Rating   *float32            // 最低评分
	Page     int                 // 页码
	PageSize int                 // 每页数量
	SortBy   string              // 排序字段
	SortDesc bool                // 是否降序
}

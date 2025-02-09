package repositories

import (
	"context"

	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type GormMediaRepository struct {
	db *gorm.DB
}

func NewGormMediaRepository(db *gorm.DB) *GormMediaRepository {
	return &GormMediaRepository{db: db}
}

// 基础 CRUD 操作
func (r *GormMediaRepository) Create(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).Create(media).Error
}

func (r *GormMediaRepository) GetByID(ctx context.Context, id uint) (*domain.Media, error) {
	var media domain.Media
	err := r.db.WithContext(ctx).First(&media, id).Error
	if err != nil {
		return nil, err
	}
	return &media, nil
}

func (r *GormMediaRepository) Update(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).Save(media).Error
}

func (r *GormMediaRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Media{}, id).Error
}

// 查询操作
func (r *GormMediaRepository) List(ctx context.Context, filter ports.MediaFilter) ([]*domain.Media, error) {
	var medias []*domain.Media
	query := r.buildFilterQuery(filter)

	if filter.Page > 0 && filter.PageSize > 0 {
		offset := (filter.Page - 1) * filter.PageSize
		query = query.Offset(offset).Limit(filter.PageSize)
	}

	if filter.SortBy != "" {
		if filter.SortDesc {
			query = query.Order(filter.SortBy + " DESC")
		} else {
			query = query.Order(filter.SortBy)
		}
	}

	err := query.WithContext(ctx).Find(&medias).Error
	return medias, err
}

func (r *GormMediaRepository) Count(ctx context.Context, filter ports.MediaFilter) (int64, error) {
	var count int64
	query := r.buildFilterQuery(filter)
	err := query.WithContext(ctx).Count(&count).Error
	return count, err
}

// 书籍特有操作
func (r *GormMediaRepository) CreateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *GormMediaRepository) GetBookDetails(ctx context.Context, mediaID uint) (*domain.BookDetails, error) {
	var details domain.BookDetails
	err := r.db.WithContext(ctx).Where("media_id = ?", mediaID).First(&details).Error
	if err != nil {
		return nil, err
	}
	return &details, nil
}

func (r *GormMediaRepository) UpdateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

// 电影特有操作
func (r *GormMediaRepository) CreateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *GormMediaRepository) GetMovieDetails(ctx context.Context, mediaID uint) (*domain.MovieDetails, error) {
	var details domain.MovieDetails
	err := r.db.WithContext(ctx).Where("media_id = ?", mediaID).First(&details).Error
	if err != nil {
		return nil, err
	}
	return &details, nil
}

func (r *GormMediaRepository) UpdateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

// 笔记操作
func (r *GormMediaRepository) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error) {
	var notes []*domain.Note
	offset := (page - 1) * pageSize
	err := r.db.WithContext(ctx).
		Where("media_id = ?", mediaID).
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&notes).Error
	return notes, err
}

func (r *GormMediaRepository) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.Note{}).Where("media_id = ?", mediaID).Count(&count).Error
	return count, err
}

func (r *GormMediaRepository) CreateNote(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Create(note).Error
}

func (r *GormMediaRepository) UpdateNote(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Save(note).Error
}

func (r *GormMediaRepository) DeleteNote(ctx context.Context, mediaID uint, noteID uint) error {
	return r.db.WithContext(ctx).Where("media_id = ? AND id = ?", mediaID, noteID).Delete(&domain.Note{}).Error
}

// 辅助方法
func (r *GormMediaRepository) buildFilterQuery(filter ports.MediaFilter) *gorm.DB {
	query := r.db.Model(&domain.Media{}).
		Select("media.*, array_to_string(tags, ',') as tags_str") // 将 tags 数组转换为字符串

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("display_name_primary LIKE ? OR display_name_secondary LIKE ?",
			"%"+*filter.Title+"%", "%"+*filter.Title+"%")
	}
	if filter.Creator != nil {
		query = query.Where("creator LIKE ?", "%"+*filter.Creator+"%")
	}
	if filter.Rating != nil {
		query = query.Where("rating >= ?", *filter.Rating)
	}
	if len(filter.Tags) > 0 {
		query = query.Where("tags && ?", pq.Array(filter.Tags)) // 使用 PostgreSQL 的数组操作符
	}

	return query
}

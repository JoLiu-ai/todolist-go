package repositories

import (
	"context"
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"gorm.io/gorm"
)

type MediaRepository struct {
	db *gorm.DB
}

func NewMediaRepository(db *gorm.DB) ports.MediaRepository {
	return &MediaRepository{db: db}
}

func (r *MediaRepository) Create(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).Create(media).Error
}

func (r *MediaRepository) List(ctx context.Context, filter ports.MediaFilter) ([]*domain.Media, error) {
	var medias []*domain.Media
	query := r.db.WithContext(ctx)

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("title LIKE ?", "%"+*filter.Title+"%")
	}
	if filter.Creator != nil {
		query = query.Where("creator LIKE ?", "%"+*filter.Creator+"%")
	}
	if filter.Rating != nil {
		query = query.Where("rating >= ?", *filter.Rating)
	}
	if len(filter.Tags) > 0 {
		query = query.Where("tags && ?", filter.Tags)
	}

	// 分页
	if filter.Page > 0 && filter.PageSize > 0 {
		offset := (filter.Page - 1) * filter.PageSize
		query = query.Offset(offset).Limit(filter.PageSize)
	}

	// 排序
	if filter.SortBy != "" {
		order := "ASC"
		if filter.SortDesc {
			order = "DESC"
		}
		query = query.Order(filter.SortBy + " " + order)
	}

	err := query.Find(&medias).Error
	return medias, err
}

func (r *MediaRepository) GetByID(ctx context.Context, id uint) (*domain.Media, error) {
	var media domain.Media
	err := r.db.WithContext(ctx).
		Preload("Notes", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC")
		}).
		First(&media, id).Error
	return &media, err
}

func (r *MediaRepository) Update(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).Save(media).Error
}

func (r *MediaRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Media{}, id).Error
}

func (r *MediaRepository) Count(ctx context.Context, filter ports.MediaFilter) (int64, error) {
	var count int64
	query := r.db.Model(&domain.Media{})

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("title LIKE ?", "%"+*filter.Title+"%")
	}
	if filter.Creator != nil {
		query = query.Where("creator LIKE ?", "%"+*filter.Creator+"%")
	}
	if filter.Rating != nil {
		query = query.Where("rating >= ?", *filter.Rating)
	}
	if len(filter.Tags) > 0 {
		query = query.Where("tags && ?", filter.Tags)
	}

	err := query.Count(&count).Error
	return count, err
}

func (r *MediaRepository) CreateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *MediaRepository) GetBookDetails(ctx context.Context, mediaID uint) (*domain.BookDetails, error) {
	var details domain.BookDetails
	err := r.db.WithContext(ctx).Where("media_id = ?", mediaID).First(&details).Error
	return &details, err
}

func (r *MediaRepository) UpdateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *MediaRepository) CreateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *MediaRepository) GetMovieDetails(ctx context.Context, mediaID uint) (*domain.MovieDetails, error) {
	var details domain.MovieDetails
	err := r.db.WithContext(ctx).Where("media_id = ?", mediaID).First(&details).Error
	return &details, err
}

func (r *MediaRepository) UpdateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *MediaRepository) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error) {
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

func (r *MediaRepository) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&domain.Note{}).
		Where("media_id = ?", mediaID).
		Count(&count).Error
	return count, err
}

func (r *MediaRepository) CreateNote(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Create(note).Error
}

func (r *MediaRepository) UpdateNote(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Save(note).Error
}

func (r *MediaRepository) DeleteNote(ctx context.Context, mediaID uint, noteID uint) error {
	return r.db.WithContext(ctx).Where("media_id = ? AND id = ?", mediaID, noteID).Delete(&domain.Note{}).Error
}

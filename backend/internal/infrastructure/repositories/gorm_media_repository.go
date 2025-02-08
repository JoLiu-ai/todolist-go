package repositories

import (
	"context"

	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"gorm.io/gorm"
)

type gormMediaRepository struct {
	db *gorm.DB
}

func NewGormMediaRepository(db *gorm.DB) ports.MediaRepository {
	return &gormMediaRepository{db: db}
}

func (r *gormMediaRepository) Create(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).
		Session(&gorm.Session{FullSaveAssociations: true}).
		Create(media).Error
}

func (r *gormMediaRepository) GetByID(ctx context.Context, id uint) (*domain.Media, error) {
	var media domain.Media
	if err := r.db.WithContext(ctx).
		Preload("Tags").
		Preload("Notes").
		Preload("BookDetails").
		Preload("MovieDetails").
		First(&media, id).Error; err != nil {
		return nil, err
	}
	return &media, nil
}

func (r *gormMediaRepository) Update(ctx context.Context, media *domain.Media) error {
	return r.db.WithContext(ctx).
		Session(&gorm.Session{FullSaveAssociations: true}).
		Save(media).Error
}

func (r *gormMediaRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&domain.Media{}, id).Error
}

func (r *gormMediaRepository) List(ctx context.Context, filter ports.MediaFilter) ([]*domain.Media, error) {
	var medias []*domain.Media
	query := r.buildFilterQuery(filter)
	if err := query.WithContext(ctx).
		Preload("Tags").
		Preload("Notes").
		Preload("BookDetails").
		Preload("MovieDetails").
		Find(&medias).Error; err != nil {
		return nil, err
	}
	return medias, nil
}

func (r *gormMediaRepository) Count(ctx context.Context, filter ports.MediaFilter) (int64, error) {
	var count int64
	query := r.buildFilterQuery(filter)
	if err := query.WithContext(ctx).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *gormMediaRepository) CreateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *gormMediaRepository) GetBookDetails(ctx context.Context, mediaID uint) (*domain.BookDetails, error) {
	var details domain.BookDetails
	if err := r.db.WithContext(ctx).
		Model(&domain.Media{ID: mediaID}).
		Association("BookDetails").
		Find(&details); err != nil {
		return nil, err
	}
	return &details, nil
}

func (r *gormMediaRepository) UpdateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *gormMediaRepository) CreateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *gormMediaRepository) GetMovieDetails(ctx context.Context, mediaID uint) (*domain.MovieDetails, error) {
	var details domain.MovieDetails
	if err := r.db.WithContext(ctx).
		Model(&domain.Media{ID: mediaID}).
		Association("MovieDetails").
		Find(&details); err != nil {
		return nil, err
	}
	return &details, nil
}

func (r *gormMediaRepository) UpdateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *gormMediaRepository) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error) {
	var notes []*domain.Note
	offset := (page - 1) * pageSize
	if err := r.db.WithContext(ctx).
		Model(&domain.Note{}).
		Where("media_id = ?", mediaID).
		Offset(offset).
		Limit(pageSize).
		Find(&notes).Error; err != nil {
		return nil, err
	}
	return notes, nil
}

func (r *gormMediaRepository) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	count := r.db.WithContext(ctx).
		Model(&domain.Media{ID: mediaID}).
		Association("Notes").
		Count()
	return count, nil
}

func (r *gormMediaRepository) CreateNote(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Create(note).Error
}

func (r *gormMediaRepository) UpdateNote(ctx context.Context, note *domain.Note) error {
	return r.db.WithContext(ctx).Save(note).Error
}

func (r *gormMediaRepository) DeleteNote(ctx context.Context, mediaID uint, noteID uint) error {
	return r.db.WithContext(ctx).
		Model(&domain.Media{ID: mediaID}).
		Association("Notes").
		Delete(&domain.Note{ID: noteID})
}

func (r *gormMediaRepository) buildFilterQuery(filter ports.MediaFilter) *gorm.DB {
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
		query = query.Joins("Tags").
			Where("tags.name IN ?", filter.Tags)
	}

	if filter.SortBy != "" {
		if filter.SortDesc {
			query = query.Order(filter.SortBy + " DESC")
		} else {
			query = query.Order(filter.SortBy)
		}
	}

	if filter.Page > 0 && filter.PageSize > 0 {
		offset := (filter.Page - 1) * filter.PageSize
		query = query.Offset(offset).Limit(filter.PageSize)
	}

	return query
}

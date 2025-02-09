package services

import (
	"context"

	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"gorm.io/gorm"
)

type mediaService struct {
	db *gorm.DB
}

func NewMediaService(db *gorm.DB) ports.MediaService {
	return &mediaService{db: db}
}

func (s *mediaService) Create(ctx context.Context, media *domain.Media) error {
	return s.db.Create(media).Error
}

func (s *mediaService) GetByID(ctx context.Context, id uint) (*domain.Media, error) {
	var media domain.Media
	err := s.db.First(&media, id).Error
	if err != nil {
		return nil, err
	}
	return &media, nil
}

func (s *mediaService) Update(ctx context.Context, media *domain.Media) error {
	return s.db.Save(media).Error
}

func (s *mediaService) Delete(ctx context.Context, id uint) error {
	return s.db.Delete(&domain.Media{}, id).Error
}

func (s *mediaService) List(ctx context.Context, filter ports.MediaFilter) ([]*domain.Media, error) {
	var medias []*domain.Media
	query := s.buildQuery(filter)

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

	err := query.Find(&medias).Error
	return medias, err
}

func (s *mediaService) Count(ctx context.Context, filter ports.MediaFilter) (int64, error) {
	var count int64
	query := s.buildQuery(filter)
	err := query.Count(&count).Error
	return count, err
}

func (s *mediaService) buildQuery(filter ports.MediaFilter) *gorm.DB {
	query := s.db.Model(&domain.Media{})

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("display_name_primary LIKE ?", "%"+*filter.Title+"%")
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
	if filter.UserID != nil {
		query = query.Where("user_id = ?", *filter.UserID)
	}

	return query
}

func (s *mediaService) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error) {
	var notes []*domain.Note
	query := s.db.Where("media_id = ?", mediaID)

	if page > 0 && pageSize > 0 {
		offset := (page - 1) * pageSize
		query = query.Offset(offset).Limit(pageSize)
	}

	err := query.Find(&notes).Error
	return notes, err
}

func (s *mediaService) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	var count int64
	err := s.db.Model(&domain.Note{}).Where("media_id = ?", mediaID).Count(&count).Error
	return count, err
}

func (s *mediaService) AddNote(ctx context.Context, mediaID uint, note *domain.Note) error {
	note.MediaID = mediaID
	return s.db.Create(note).Error
}

func (s *mediaService) UpdateNote(ctx context.Context, mediaID uint, note *domain.Note) error {
	return s.db.Where("media_id = ? AND id = ?", mediaID, note.ID).Save(note).Error
}

func (s *mediaService) DeleteNote(ctx context.Context, mediaID, noteID uint) error {
	return s.db.Where("media_id = ? AND id = ?", mediaID, noteID).Delete(&domain.Note{}).Error
}

package services

import (
	"context"
	"errors"
	"fmt"
	"log"

	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
)

// MediaService defines the interface for media-related operations
type MediaService interface {
	Create(ctx context.Context, media *models.Media) error
	GetByID(ctx context.Context, id, userID int) (*models.Media, error)
	Update(ctx context.Context, id int, media *models.Media) error
	Delete(ctx context.Context, id, userID int) error
	List(ctx context.Context, filter models.MediaFilter) ([]*models.Media, error)
	Count(ctx context.Context, filter models.MediaFilter) (int64, error)

	GetNotes(ctx context.Context, mediaID int, page, pageSize int) ([]*models.Note, error)
	CountNotes(ctx context.Context, mediaID int) (int64, error)
	CreateNote(ctx context.Context, mediaID int, note *models.Note) error
	UpdateNote(ctx context.Context, mediaID int, note *models.Note) error
	DeleteNote(ctx context.Context, mediaID, noteID int) error

	CreateBookDetails(ctx context.Context, details *models.BookDetails) error
	GetBookDetails(ctx context.Context, mediaID int) (*models.BookDetails, error)
	UpdateBookDetails(ctx context.Context, details *models.BookDetails) error

	CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error
	GetMovieDetails(ctx context.Context, mediaID int) (*models.MovieDetails, error)
	UpdateMovieDetails(ctx context.Context, details *models.MovieDetails) error

	GetStats(ctx context.Context, userID uint) (*models.MediaStats, error)
	GetRecent(ctx context.Context, userID uint, limit int) ([]*models.Media, error)
}

// mediaService implements MediaService interface
type mediaService struct {
	repo *repository.MediaRepository
}

// NewMediaService creates a new MediaService instance
func NewMediaService(repo *repository.MediaRepository) MediaService {
	return &mediaService{repo: repo}
}

func (s *mediaService) Create(ctx context.Context, media *models.Media) error {
	log.Printf("[MediaService.Create] Starting media creation with data: %+v", media)

	// 验证媒体数据
	if err := s.validateMedia(media); err != nil {
		log.Printf("[MediaService.Create] Validation failed: %v", err)
		return fmt.Errorf("media validation failed: %v", err)
	}

	// 设置默认值
	if media.Progress == 0 {
		log.Printf("[MediaService.Create] Set default progress to 0")
	}
	if media.Rating == 0 {
		log.Printf("[MediaService.Create] Set default rating to 0")
	}

	// 创建媒体记录
	if err := s.repo.Create(ctx, media); err != nil {
		log.Printf("[MediaService.Create] Database error: %+v", err)
		return fmt.Errorf("failed to create media in database: %v", err)
	}

	log.Printf("[MediaService.Create] Successfully created media with ID: %d", media.ID)
	return nil
}

func (s *mediaService) validateMedia(media *models.Media) error {
	log.Printf("[MediaService.validateMedia] Starting validation for media: %+v", media)

	if media.Title == "" {
		return errors.New("title is required")
	}
	if media.Type == "" {
		return errors.New("type is required")
	}
	if media.Status == "" {
		return errors.New("status is required")
	}

	// 验证类型
	if media.Type != models.MediaTypeBook && media.Type != models.MediaTypeMovie {
		log.Printf("[MediaService.validateMedia] Invalid type: %s", media.Type)
		return fmt.Errorf("invalid media type: %s", media.Type)
	}

	// 验证状态
	validStatuses := []string{models.StatusInProgress, models.StatusCompleted, models.StatusPlanToRead, models.StatusDropped}
	isValidStatus := false
	for _, status := range validStatuses {
		if media.Status == status {
			isValidStatus = true
			break
		}
	}
	if !isValidStatus {
		log.Printf("[MediaService.validateMedia] Invalid status: %s", media.Status)
		return fmt.Errorf("invalid status: %s", media.Status)
	}

	log.Printf("[MediaService.validateMedia] Validation passed")
	return nil
}

func (s *mediaService) GetByID(ctx context.Context, id, userID int) (*models.Media, error) {
	return s.repo.GetByID(ctx, id, userID)
}

func (s *mediaService) Update(ctx context.Context, id int, media *models.Media) error {
	return s.repo.Update(ctx, id, media)
}

func (s *mediaService) Delete(ctx context.Context, id, userID int) error {
	return s.repo.Delete(ctx, id, userID)
}

func (s *mediaService) List(ctx context.Context, filter models.MediaFilter) ([]*models.Media, error) {
	return s.repo.List(ctx, filter)
}

func (s *mediaService) Count(ctx context.Context, filter models.MediaFilter) (int64, error) {
	return s.repo.Count(ctx, filter)
}

func (s *mediaService) GetNotes(ctx context.Context, mediaID int, page, pageSize int) ([]*models.Note, error) {
	return s.repo.GetNotes(ctx, mediaID, page, pageSize)
}

func (s *mediaService) CountNotes(ctx context.Context, mediaID int) (int64, error) {
	return s.repo.CountNotes(ctx, mediaID)
}

func (s *mediaService) CreateNote(ctx context.Context, mediaID int, note *models.Note) error {
	return s.repo.CreateNote(ctx, mediaID, note)
}

func (s *mediaService) UpdateNote(ctx context.Context, mediaID int, note *models.Note) error {
	return s.repo.UpdateNote(ctx, mediaID, note)
}

func (s *mediaService) DeleteNote(ctx context.Context, mediaID, noteID int) error {
	return s.repo.DeleteNote(ctx, mediaID, noteID)
}

func (s *mediaService) CreateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return s.repo.CreateBookDetails(ctx, details)
}

func (s *mediaService) GetBookDetails(ctx context.Context, mediaID int) (*models.BookDetails, error) {
	return s.repo.GetBookDetails(ctx, mediaID)
}

func (s *mediaService) UpdateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return s.repo.UpdateBookDetails(ctx, details)
}

func (s *mediaService) CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return s.repo.CreateMovieDetails(ctx, details)
}

func (s *mediaService) GetMovieDetails(ctx context.Context, mediaID int) (*models.MovieDetails, error) {
	return s.repo.GetMovieDetails(ctx, mediaID)
}

func (s *mediaService) UpdateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return s.repo.UpdateMovieDetails(ctx, details)
}

func (s *mediaService) GetStats(ctx context.Context, userID uint) (*models.MediaStats, error) {
	return s.repo.GetStats(ctx, userID)
}

func (s *mediaService) GetRecent(ctx context.Context, userID uint, limit int) ([]*models.Media, error) {
	if limit <= 0 {
		limit = 5 // 默认返回5条
	}
	return s.repo.GetRecent(ctx, userID, limit)
}

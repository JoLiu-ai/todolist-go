package services

import (
	"context"

	"cute-todo/backend/models"
)

// MediaService defines the interface for media-related operations
type MediaService interface {
	Create(ctx context.Context, media *models.Media) error
	GetByID(ctx context.Context, id uint) (*models.Media, error)
	Update(ctx context.Context, media *models.Media) error
	Delete(ctx context.Context, id uint) error
	List(ctx context.Context, filter models.MediaFilter) ([]*models.Media, error)
	Count(ctx context.Context, filter models.MediaFilter) (int64, error)

	GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*models.Note, error)
	CountNotes(ctx context.Context, mediaID uint) (int64, error)
	CreateNote(ctx context.Context, mediaID uint, note *models.Note) error
	UpdateNote(ctx context.Context, mediaID uint, note *models.Note) error
	DeleteNote(ctx context.Context, mediaID, noteID uint) error

	CreateBookDetails(ctx context.Context, details *models.BookDetails) error
	GetBookDetails(ctx context.Context, mediaID uint) (*models.BookDetails, error)
	UpdateBookDetails(ctx context.Context, details *models.BookDetails) error

	CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error
	GetMovieDetails(ctx context.Context, mediaID uint) (*models.MovieDetails, error)
	UpdateMovieDetails(ctx context.Context, details *models.MovieDetails) error
}

// mediaService implements MediaService interface
type mediaService struct {
	repo models.MediaRepository
}

// NewMediaService creates a new MediaService instance
func NewMediaService(repo models.MediaRepository) MediaService {
	return &mediaService{repo: repo}
}

func (s *mediaService) Create(ctx context.Context, media *models.Media) error {
	return s.repo.Create(ctx, media)
}

func (s *mediaService) GetByID(ctx context.Context, id uint) (*models.Media, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *mediaService) Update(ctx context.Context, media *models.Media) error {
	return s.repo.Update(ctx, media)
}

func (s *mediaService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

func (s *mediaService) List(ctx context.Context, filter models.MediaFilter) ([]*models.Media, error) {
	return s.repo.List(ctx, filter)
}

func (s *mediaService) Count(ctx context.Context, filter models.MediaFilter) (int64, error) {
	return s.repo.Count(ctx, filter)
}

func (s *mediaService) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*models.Note, error) {
	return s.repo.GetNotes(ctx, mediaID, page, pageSize)
}

func (s *mediaService) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	return s.repo.CountNotes(ctx, mediaID)
}

func (s *mediaService) CreateNote(ctx context.Context, mediaID uint, note *models.Note) error {
	return s.repo.CreateNote(ctx, mediaID, note)
}

func (s *mediaService) UpdateNote(ctx context.Context, mediaID uint, note *models.Note) error {
	return s.repo.UpdateNote(ctx, mediaID, note)
}

func (s *mediaService) DeleteNote(ctx context.Context, mediaID, noteID uint) error {
	return s.repo.DeleteNote(ctx, mediaID, noteID)
}

func (s *mediaService) CreateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return s.repo.CreateBookDetails(ctx, details)
}

func (s *mediaService) GetBookDetails(ctx context.Context, mediaID uint) (*models.BookDetails, error) {
	return s.repo.GetBookDetails(ctx, mediaID)
}

func (s *mediaService) UpdateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return s.repo.UpdateBookDetails(ctx, details)
}

func (s *mediaService) CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return s.repo.CreateMovieDetails(ctx, details)
}

func (s *mediaService) GetMovieDetails(ctx context.Context, mediaID uint) (*models.MovieDetails, error) {
	return s.repo.GetMovieDetails(ctx, mediaID)
}

func (s *mediaService) UpdateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return s.repo.UpdateMovieDetails(ctx, details)
} 
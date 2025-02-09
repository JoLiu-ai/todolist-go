package services

import (
	"context"

	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"
)

type MediaService struct {
	repo ports.MediaRepository
}

func NewMediaService(repo ports.MediaRepository) *MediaService {
	return &MediaService{repo: repo}
}

func (s *MediaService) List(ctx context.Context, filter ports.MediaFilter) ([]*domain.Media, error) {
	return s.repo.List(ctx, filter)
}

func (s *MediaService) Create(ctx context.Context, media *domain.Media) error {
	return s.repo.Create(ctx, media)
}

func (s *MediaService) GetByID(ctx context.Context, id uint) (*domain.Media, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *MediaService) Update(ctx context.Context, media *domain.Media) error {
	return s.repo.Update(ctx, media)
}

func (s *MediaService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}

func (s *MediaService) CreateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return s.repo.CreateBookDetails(ctx, details)
}

func (s *MediaService) GetBookDetails(ctx context.Context, mediaID uint) (*domain.BookDetails, error) {
	return s.repo.GetBookDetails(ctx, mediaID)
}

func (s *MediaService) UpdateBookDetails(ctx context.Context, details *domain.BookDetails) error {
	return s.repo.UpdateBookDetails(ctx, details)
}

func (s *MediaService) CreateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return s.repo.CreateMovieDetails(ctx, details)
}

func (s *MediaService) GetMovieDetails(ctx context.Context, mediaID uint) (*domain.MovieDetails, error) {
	return s.repo.GetMovieDetails(ctx, mediaID)
}

func (s *MediaService) UpdateMovieDetails(ctx context.Context, details *domain.MovieDetails) error {
	return s.repo.UpdateMovieDetails(ctx, details)
}

func (s *MediaService) Count(ctx context.Context, filter ports.MediaFilter) (int64, error) {
	return s.repo.Count(ctx, filter)
}

func (s *MediaService) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*domain.Note, error) {
	return s.repo.GetNotes(ctx, mediaID, page, pageSize)
}

func (s *MediaService) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	return s.repo.CountNotes(ctx, mediaID)
}

func (s *MediaService) AddNote(ctx context.Context, mediaID uint, note *domain.Note) error {
	note.MediaID = mediaID
	return s.repo.CreateNote(ctx, mediaID, note)
}

func (s *MediaService) UpdateNote(ctx context.Context, mediaID uint, note *domain.Note) error {
	note.MediaID = mediaID
	return s.repo.UpdateNote(ctx, mediaID, note)
}

func (s *MediaService) DeleteNote(ctx context.Context, mediaID uint, noteID uint) error {
	return s.repo.DeleteNote(ctx, mediaID, noteID)
}

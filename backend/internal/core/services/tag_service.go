package services

import (
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"
)

type TagService struct {
	repo ports.TagRepository
}

func NewTagService(repo ports.TagRepository) *TagService {
	return &TagService{
		repo: repo,
	}
}

func (s *TagService) CreateTag(name string) error {
	tag := &domain.Tag{
		Name: name,
	}
	return s.repo.Create(tag)
}

func (s *TagService) GetAllTags() ([]domain.Tag, error) {
	return s.repo.GetAll()
}

func (s *TagService) GetTagByID(id uint) (*domain.Tag, error) {
	return s.repo.GetByID(id)
}

func (s *TagService) UpdateTag(tag *domain.Tag) error {
	return s.repo.Update(tag)
}

func (s *TagService) DeleteTag(id uint) error {
	return s.repo.Delete(id)
}

func (s *TagService) GetTagsByMediaID(mediaID uint) ([]domain.Tag, error) {
	return s.repo.GetByMediaID(mediaID)
}

func (s *TagService) AddTagToMedia(mediaID uint, tagID uint) error {
	return s.repo.AddTagToMedia(mediaID, tagID)
}

func (s *TagService) RemoveTagFromMedia(mediaID uint, tagID uint) error {
	return s.repo.RemoveTagFromMedia(mediaID, tagID)
}

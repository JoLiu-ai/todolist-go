package services

import (
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"
)

type TagService struct {
	repo ports.TagRepository
}

func NewTagService(repo ports.TagRepository) *TagService {
	return &TagService{repo: repo}
}

func (s *TagService) CreateTag(name string) (*domain.Tag, error) {
	tag := domain.NewTag(name)
	err := s.repo.Create(tag)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func (s *TagService) UpdateTag(id int, name string) (*domain.Tag, error) {
	tag, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	tag.Update(name)
	err = s.repo.Update(tag)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func (s *TagService) DeleteTag(id int) error {
	return s.repo.Delete(id)
}

func (s *TagService) GetAllTags() ([]*domain.Tag, error) {
	return s.repo.GetAll()
}

func (s *TagService) GetMediaTags(mediaID int) ([]*domain.Tag, error) {
	return s.repo.GetMediaTags(mediaID)
}

func (s *TagService) AddMediaTag(mediaID, tagID int) error {
	err := s.repo.AddMediaTag(mediaID, tagID)
	if err != nil {
		return err
	}
	return s.repo.IncrementCount(tagID)
}

func (s *TagService) RemoveMediaTag(mediaID, tagID int) error {
	err := s.repo.RemoveMediaTag(mediaID, tagID)
	if err != nil {
		return err
	}
	return s.repo.DecrementCount(tagID)
}

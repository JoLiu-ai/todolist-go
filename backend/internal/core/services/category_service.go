package services

import (
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"
)

type CategoryService struct {
	repo ports.CategoryRepository
}

func NewCategoryService(repo ports.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) CreateCategory(name, mediaType string) (*domain.Category, error) {
	category := &domain.Category{
		Name:      name,
		MediaType: mediaType,
	}
	err := s.repo.Create(category)
	return category, err
}

func (s *CategoryService) GetCategoriesByType(mediaType string) ([]domain.Category, error) {
	return s.repo.FindAllByType(mediaType)
}

func (s *CategoryService) UpdateCategory(id int, name string) (*domain.Category, error) {
	category, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	category.Name = name
	err = s.repo.Update(category)
	return category, err
}

func (s *CategoryService) DeleteCategory(id int) error {
	return s.repo.Delete(id)
}

func (s *CategoryService) IncrementCategoryCount(id int) error {
	return s.repo.IncrementCount(id)
}

func (s *CategoryService) DecrementCategoryCount(id int) error {
	return s.repo.DecrementCount(id)
}

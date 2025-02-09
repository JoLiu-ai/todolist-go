package services

import (
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"
)

type CategoryService struct {
	repo ports.CategoryRepository
}

func NewCategoryService(repo ports.CategoryRepository) *CategoryService {
	return &CategoryService{
		repo: repo,
	}
}

func (s *CategoryService) CreateCategory(name, mediaType string) error {
	category := domain.NewCategory(name, mediaType)
	return s.repo.Create(category)
}

func (s *CategoryService) GetAllCategories() ([]domain.Category, error) {
	return s.repo.GetAll()
}

func (s *CategoryService) GetCategoryByID(id uint) (*domain.Category, error) {
	return s.repo.GetByID(id)
}

func (s *CategoryService) UpdateCategory(category *domain.Category) error {
	return s.repo.Update(category)
}

func (s *CategoryService) DeleteCategory(id uint) error {
	return s.repo.Delete(id)
}

func (s *CategoryService) GetCategoriesByType(mediaType string) ([]domain.Category, error) {
	return s.repo.GetByType(mediaType)
}

func (s *CategoryService) IncrementCategoryCount(id uint) error {
	return s.repo.IncrementCount(id)
}

func (s *CategoryService) DecrementCategoryCount(id uint) error {
	return s.repo.DecrementCount(id)
}

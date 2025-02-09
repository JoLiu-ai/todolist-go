package ports

import "cute-todo/backend/internal/core/domain"

type CategoryRepository interface {
	Create(category *domain.Category) error
	GetAll() ([]domain.Category, error)
	GetByID(id uint) (*domain.Category, error)
	Update(category *domain.Category) error
	Delete(id uint) error
	GetByType(mediaType string) ([]domain.Category, error)
	IncrementCount(id uint) error
	DecrementCount(id uint) error
}

package ports

import "cute-todo/backend/internal/core/domain"

type TagRepository interface {
	Create(tag *domain.Tag) error
	GetAll() ([]domain.Tag, error)
	GetByID(id uint) (*domain.Tag, error)
	Update(tag *domain.Tag) error
	Delete(id uint) error
	GetByMediaID(mediaID uint) ([]domain.Tag, error)
	AddTagToMedia(mediaID uint, tagID uint) error
	RemoveTagFromMedia(mediaID uint, tagID uint) error
}

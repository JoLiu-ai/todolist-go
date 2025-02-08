package repositories

import (
	"cute-todo/backend/internal/core/domain"

	"gorm.io/gorm"
)

type CategoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *CategoryRepository) Update(category *domain.Category) error {
	return r.db.Save(category).Error
}

func (r *CategoryRepository) Delete(id int) error {
	return r.db.Delete(&domain.Category{}, id).Error
}

func (r *CategoryRepository) GetByID(id int) (*domain.Category, error) {
	var category domain.Category
	err := r.db.First(&category, id).Error
	return &category, err
}

func (r *CategoryRepository) GetByType(mediaType string) ([]*domain.Category, error) {
	var categories []*domain.Category
	err := r.db.Where("type = ?", mediaType).Find(&categories).Error
	if err != nil {
		return nil, err
	}
	return categories, nil
}

func (r *CategoryRepository) IncrementCount(id int) error {
	return r.db.Model(&domain.Category{}).Where("id = ?", id).
		UpdateColumn("count", gorm.Expr("count + ?", 1)).Error
}

func (r *CategoryRepository) DecrementCount(id int) error {
	return r.db.Model(&domain.Category{}).Where("id = ? AND count > 0", id).
		UpdateColumn("count", gorm.Expr("count - ?", 1)).Error
}

package repositories

import (
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"gorm.io/gorm"
)

type GormCategoryRepository struct {
	db *gorm.DB
}

func NewGormCategoryRepository(db *gorm.DB) ports.CategoryRepository {
	return &GormCategoryRepository{db: db}
}

func (r *GormCategoryRepository) Create(category *domain.Category) error {
	return r.db.Create(category).Error
}

func (r *GormCategoryRepository) FindByID(id int) (*domain.Category, error) {
	var category domain.Category
	err := r.db.First(&category, id).Error
	return &category, err
}

func (r *GormCategoryRepository) Update(category *domain.Category) error {
	return r.db.Save(category).Error
}

func (r *GormCategoryRepository) Delete(id int) error {
	return r.db.Delete(&domain.Category{}, id).Error
}

func (r *GormCategoryRepository) FindAllByType(mediaType string) ([]domain.Category, error) {
	var categories []domain.Category
	err := r.db.Where("type = ?", mediaType).Find(&categories).Error
	return categories, err
}

func (r *GormCategoryRepository) IncrementCount(id int) error {
	return r.db.Model(&domain.Category{}).Where("id = ?", id).UpdateColumn("count", gorm.Expr("count + ?", 1)).Error
}

func (r *GormCategoryRepository) DecrementCount(id int) error {
	return r.db.Model(&domain.Category{}).Where("id = ?", id).UpdateColumn("count", gorm.Expr("count - ?", 1)).Error
}

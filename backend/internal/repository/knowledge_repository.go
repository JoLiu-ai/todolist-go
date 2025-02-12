package repository

import (
	"context"
	"cute-todo/backend/internal/models"

	"gorm.io/gorm"
)

type KnowledgeRepository struct {
	db *gorm.DB
}

func NewKnowledgeRepository(db *gorm.DB) *KnowledgeRepository {
	return &KnowledgeRepository{db: db}
}

func (r *KnowledgeRepository) Create(ctx context.Context, knowledge *models.Knowledge) error {
	return r.db.WithContext(ctx).Create(knowledge).Error
}

func (r *KnowledgeRepository) Update(ctx context.Context, id int, knowledge *models.Knowledge) error {
	result := r.db.WithContext(ctx).Model(&models.Knowledge{}).
		Where("id = ? AND user_id = ?", id, knowledge.UserID).
		Updates(map[string]interface{}{
			"title":    knowledge.Title,
			"content":  knowledge.Content,
			"category": knowledge.Category,
			"tags":     knowledge.Tags,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *KnowledgeRepository) Delete(ctx context.Context, id, userID int) error {
	result := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&models.Knowledge{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *KnowledgeRepository) GetByID(ctx context.Context, id, userID int) (*models.Knowledge, error) {
	var knowledge models.Knowledge
	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		First(&knowledge).Error
	if err != nil {
		return nil, err
	}
	return &knowledge, nil
}

func (r *KnowledgeRepository) List(ctx context.Context, userID int, category string) ([]models.Knowledge, error) {
	var knowledge []models.Knowledge
	query := r.db.WithContext(ctx).Where("user_id = ?", userID)

	if category != "" {
		query = query.Where("category = ?", category)
	}

	err := query.Order("created_at desc").Find(&knowledge).Error
	if err != nil {
		return nil, err
	}

	return knowledge, nil
}

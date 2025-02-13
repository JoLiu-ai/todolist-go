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

// Create 创建知识条目
func (r *KnowledgeRepository) Create(ctx context.Context, knowledge *models.Knowledge) error {
	return r.db.WithContext(ctx).Create(knowledge).Error
}

// GetByID 获取指定ID的知识条目
func (r *KnowledgeRepository) GetByID(ctx context.Context, id int) (*models.Knowledge, error) {
	var knowledge models.Knowledge
	err := r.db.WithContext(ctx).First(&knowledge, id).Error
	if err != nil {
		return nil, err
	}
	return &knowledge, nil
}

// List 获取知识列表
func (r *KnowledgeRepository) List(ctx context.Context, userID int) ([]*models.Knowledge, error) {
	var knowledge []*models.Knowledge
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&knowledge).Error
	return knowledge, err
}

// Update 更新知识条目
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

// Delete 删除知识条目
func (r *KnowledgeRepository) Delete(ctx context.Context, id int) error {
	result := r.db.WithContext(ctx).
		Delete(&models.Knowledge{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

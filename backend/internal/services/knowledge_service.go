package services

import (
	"context"
	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
)

// KnowledgeService handles business logic for knowledge operations
type KnowledgeService interface {
	Create(ctx context.Context, knowledge *models.Knowledge) error
	GetByID(ctx context.Context, id int) (*models.Knowledge, error)
	List(ctx context.Context, userID int) ([]*models.Knowledge, error)
	Update(ctx context.Context, id int, knowledge *models.Knowledge) error
	Delete(ctx context.Context, id int) error
}

type knowledgeService struct {
	repo *repository.KnowledgeRepository
}

// NewKnowledgeService creates a new instance of KnowledgeService
func NewKnowledgeService(repo *repository.KnowledgeRepository) KnowledgeService {
	return &knowledgeService{repo: repo}
}

// Create 创建知识条目
func (s *knowledgeService) Create(ctx context.Context, knowledge *models.Knowledge) error {
	return s.repo.Create(ctx, knowledge)
}

// GetByID 获取指定ID的知识条目
func (s *knowledgeService) GetByID(ctx context.Context, id int) (*models.Knowledge, error) {
	return s.repo.GetByID(ctx, id)
}

// List 获取知识列表
func (s *knowledgeService) List(ctx context.Context, userID int) ([]*models.Knowledge, error) {
	return s.repo.List(ctx, userID)
}

// Update 更新知识条目
func (s *knowledgeService) Update(ctx context.Context, id int, knowledge *models.Knowledge) error {
	return s.repo.Update(ctx, id, knowledge)
}

// Delete 删除知识条目
func (s *knowledgeService) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}

package services

import (
	"context"
	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
	"fmt"
)

type TaskService struct {
	repo *repository.TaskRepository
}

func NewTaskService(repo *repository.TaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

// Create 创建任务
func (s *TaskService) Create(ctx context.Context, task *models.Task) error {
	fmt.Printf("\n=== TaskService.Create Start ===\n")
	fmt.Printf("Creating task: %+v\n", task)

	err := s.repo.Create(ctx, task)
	if err != nil {
		fmt.Printf("Failed to create task in repository: %v\n", err)
		return err
	}

	return nil
}

// GetByID 根据ID获取任务
func (s *TaskService) GetByID(ctx context.Context, id, userID int) (*models.Task, error) {
	task, err := s.repo.GetByID(ctx, id, userID)
	if err != nil {
		return nil, err
	}
	return task, nil
}

// List 获取任务列表
func (s *TaskService) List(ctx context.Context, userID int) ([]models.Task, error) {
	return s.repo.List(ctx, userID)
}

// Update 更新任务
func (s *TaskService) Update(ctx context.Context, id int, task *models.Task) error {
	return s.repo.Update(ctx, id, task)
}

// Delete 删除任务
func (s *TaskService) Delete(ctx context.Context, id, userID int) error {
	return s.repo.Delete(ctx, id, userID)
}

// GetTodayTasks 获取今日任务
func (s *TaskService) GetTodayTasks(ctx context.Context, userID int) ([]models.Task, error) {
	return s.repo.GetTodayTasks(ctx, userID)
}

// GetTaskStats 获取任务统计信息
func (s *TaskService) GetTaskStats(ctx context.Context, userID int) (*models.TaskStats, error) {
	return s.repo.GetTaskStats(ctx, userID)
}

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

func (s *TaskService) CreateTask(ctx context.Context, task *models.Task) error {
	return s.repo.Create(ctx, task)
}

func (s *TaskService) GetTask(ctx context.Context, id, userID int) (*models.Task, error) {
	fmt.Printf("\n=== TaskService.GetTask called ===\n")
	fmt.Printf("查找任务 - ID: %d, 用户ID: %d\n", id, userID)
	task, err := s.repo.GetByID(ctx, id, userID)
	if err != nil {
		fmt.Printf("数据库查询失败: %v\n", err)
		return nil, err
	}
	fmt.Printf("查询结果: %+v\n", task)
	return task, nil
}

func (s *TaskService) ListTasks(ctx context.Context, userID int) ([]models.Task, error) {
	return s.repo.List(ctx, userID)
}

func (s *TaskService) UpdateTask(ctx context.Context, id int, task *models.Task) error {
	return s.repo.Update(ctx, id, task)
}

func (s *TaskService) DeleteTask(ctx context.Context, id, userID int) error {
	return s.repo.Delete(ctx, id, userID)
}

func (s *TaskService) GetTodayTasks(ctx context.Context, userID int) ([]models.Task, error) {
	return s.repo.GetTodayTasks(ctx, userID)
}

func (s *TaskService) GetTaskStats(ctx context.Context, userID int) (*models.TaskStats, error) {
	return s.repo.GetTaskStats(ctx, userID)
}

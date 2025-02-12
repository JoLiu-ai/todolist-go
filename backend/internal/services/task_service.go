package services

import (
	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
	"fmt"
)

type TaskService struct {
	repo *repository.GormTaskRepository
}

func NewTaskService(repo *repository.GormTaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

func (s *TaskService) CreateTask(task *models.Task) error {
	return s.repo.CreateTask(task)
}

func (s *TaskService) GetTask(id uint, userID uint) (*models.Task, error) {
	fmt.Printf("\n=== TaskService.GetTask called ===\n")
	fmt.Printf("查找任务 - ID: %d, 用户ID: %d\n", id, userID)
	task, err := s.repo.GetTask(id, userID)
	if err != nil {
		fmt.Printf("数据库查询失败: %v\n", err)
		return nil, err
	}
	fmt.Printf("查询结果: %+v\n", task)
	return task, nil
}

func (s *TaskService) ListTasks(userID uint, status string) ([]models.Task, error) {
	return s.repo.ListTasks(userID, status)
}

func (s *TaskService) UpdateTask(id uint, userID uint, updates map[string]interface{}) error {
	return s.repo.UpdateTask(id, userID, updates)
}

func (s *TaskService) DeleteTask(id uint, userID uint) error {
	return s.repo.DeleteTask(id, userID)
}

func (s *TaskService) GetTodayTasks(userID uint) ([]models.Task, error) {
	return s.repo.GetTodayTasks(userID)
}

func (s *TaskService) GetTaskStats(userID uint) (*models.TaskStats, error) {
	return s.repo.GetTaskStats(userID)
}

package repository

import (
	"context"
	"fmt"
	"time"

	"cute-todo/backend/internal/models"

	"gorm.io/gorm"
)

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) Create(ctx context.Context, task *models.Task) error {
	fmt.Printf("\n=== TaskRepository.Create Start ===\n")
	fmt.Printf("Creating task in database: %+v\n", task)

	err := r.db.WithContext(ctx).Create(task).Error
	if err != nil {
		fmt.Printf("Database error while creating task: %v\n", err)
		return err
	}

	fmt.Printf("Task created in database: %+v\n", task)
	fmt.Println("=== TaskRepository.Create End ===\n")
	return nil
}

func (r *TaskRepository) Update(ctx context.Context, id int, task *models.Task) error {
	result := r.db.WithContext(ctx).Model(&models.Task{}).
		Where("id = ? AND user_id = ?", id, task.UserID).
		Updates(map[string]interface{}{
			"title":       task.Title,
			"description": task.Description,
			"status":      task.Status,
			"priority":    task.Priority,
			"category":    task.Category,
			"due_date":    task.DueDate,
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *TaskRepository) Delete(ctx context.Context, id, userID int) error {
	result := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&models.Task{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *TaskRepository) GetByID(ctx context.Context, id, userID int) (*models.Task, error) {
	var task models.Task
	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		First(&task).Error
	if err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *TaskRepository) List(ctx context.Context, userID int) ([]models.Task, error) {
	var tasks []models.Task
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepository) GetTodayTasks(ctx context.Context, userID int) ([]models.Task, error) {
	var tasks []models.Task
	today := time.Now().Format("2006-01-02")
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND DATE(due_date) = ?", userID, today).
		Order("priority desc").
		Find(&tasks).Error
	if err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *TaskRepository) GetTaskStats(ctx context.Context, userID int) (*models.TaskStats, error) {
	var stats models.TaskStats
	today := time.Now().Format("2006-01-02")

	// 获取总任务数
	if err := r.db.WithContext(ctx).Model(&models.Task{}).
		Where("user_id = ?", userID).
		Count(&stats.TotalTasks).Error; err != nil {
		return nil, err
	}

	// 获取已完成任务数
	if err := r.db.WithContext(ctx).Model(&models.Task{}).
		Where("user_id = ? AND status = ?", userID, "completed").
		Count(&stats.CompletedTasks).Error; err != nil {
		return nil, err
	}

	// 获取待处理任务数
	if err := r.db.WithContext(ctx).Model(&models.Task{}).
		Where("user_id = ? AND status != ?", userID, "completed").
		Count(&stats.PendingTasks).Error; err != nil {
		return nil, err
	}

	// 获取逾期任务数
	if err := r.db.WithContext(ctx).Model(&models.Task{}).
		Where("user_id = ? AND status != ? AND due_date < ?", userID, "completed", today).
		Count(&stats.OverdueTasks).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

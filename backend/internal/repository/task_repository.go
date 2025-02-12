package repository

import (
	"fmt"
	"time"

	"cute-todo/backend/internal/models"

	"gorm.io/gorm"
)

type GormTaskRepository struct {
	db *gorm.DB
}

func NewGormTaskRepository(db *gorm.DB) *GormTaskRepository {
	return &GormTaskRepository{db: db}
}

func (r *GormTaskRepository) CreateTask(task *models.Task) error {
	return r.db.Create(task).Error
}

func (r *GormTaskRepository) GetTask(id uint, userID uint) (*models.Task, error) {
	fmt.Printf("\n=== TaskRepository.GetTask called ===\n")
	fmt.Printf("执行数据库查询 - ID: %d, 用户ID: %d\n", id, userID)

	var task models.Task
	result := r.db.Where("id = ? AND user_id = ?", id, userID).First(&task)

	if result.Error != nil {
		fmt.Printf("数据库错误: %v\n", result.Error)
		return nil, result.Error
	}

	fmt.Printf("查询到的任务: %+v\n", task)
	return &task, nil
}

func (r *GormTaskRepository) ListTasks(userID uint, status string) ([]models.Task, error) {
	var tasks []models.Task
	query := r.db.Where("user_id = ?", userID)
	if status != "" {
		query = query.Where("status = ?", status)
	}
	if err := query.Order("priority desc, due_date asc").Find(&tasks).Error; err != nil {
		return nil, err
	}
	return tasks, nil
}

func (r *GormTaskRepository) UpdateTask(id uint, userID uint, updates map[string]interface{}) error {
	return r.db.Model(&models.Task{}).Where("id = ? AND user_id = ?", id, userID).Updates(updates).Error
}

func (r *GormTaskRepository) DeleteTask(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Task{}).Error
}

func (r *GormTaskRepository) GetTodayTasks(userID uint) ([]models.Task, error) {
	var tasks []models.Task
	today := time.Now()
	startOfDay := time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	err := r.db.Where("user_id = ? AND due_date BETWEEN ? AND ?", userID, startOfDay, endOfDay).
		Order("priority desc").
		Find(&tasks).Error

	return tasks, err
}

func (r *GormTaskRepository) GetTaskStats(userID uint) (*models.TaskStats, error) {
	var stats models.TaskStats
	now := time.Now()

	// 使用事务确保统计数据的一致性
	err := r.db.Transaction(func(tx *gorm.DB) error {
		// 获取总任务数
		if err := tx.Model(&models.Task{}).Where("user_id = ?", userID).Count(&stats.TotalTasks).Error; err != nil {
			return err
		}

		// 获取已完成任务数
		if err := tx.Model(&models.Task{}).Where("user_id = ? AND status = ?", userID, "completed").Count(&stats.CompletedTasks).Error; err != nil {
			return err
		}

		// 获取待处理任务数
		if err := tx.Model(&models.Task{}).Where("user_id = ? AND status = ?", userID, "pending").Count(&stats.PendingTasks).Error; err != nil {
			return err
		}

		// 获取已逾期任务数（未完成且已过期的任务）
		if err := tx.Model(&models.Task{}).
			Where("user_id = ? AND status != ? AND due_date < ?", userID, "completed", now).
			Count(&stats.OverdueTasks).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return &stats, nil
}

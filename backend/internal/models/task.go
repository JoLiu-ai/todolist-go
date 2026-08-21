package models

import "time"

// Task 对应数据库 tasks 表，代表一条待办任务。
type Task struct {
	ID          int        `json:"id" gorm:"primaryKey"`
	Title       string     `json:"title" gorm:"column:title;not null"`
	Description string     `json:"description" gorm:"column:description"`
	Status      string     `json:"status" gorm:"column:status;default:pending"`
	Priority    int        `json:"priority" gorm:"column:priority;default:1"`
	Category    string     `json:"category" gorm:"column:category;default:other"`
	DueDate     *time.Time `json:"due_date" gorm:"column:due_date"`
	UserID      int        `json:"user_id" gorm:"column:user_id;not null"`
	CreatedAt   time.Time  `json:"created_at" gorm:"column:created_at"`
	UpdatedAt   time.Time  `json:"updated_at" gorm:"column:updated_at"`
}

// TableName 固定表名。
func (Task) TableName() string { return "tasks" }

// TaskStats 汇总某个用户的任务统计，用于首页展示。
type TaskStats struct {
	TotalTasks     int64 `json:"total_tasks"`
	CompletedTasks int64 `json:"completed_tasks"`
	PendingTasks   int64 `json:"pending_tasks"`
	OverdueTasks   int64 `json:"overdue_tasks"`
}

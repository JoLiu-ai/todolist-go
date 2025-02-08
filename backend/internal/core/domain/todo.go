package domain

import (
	"time"
)

// Todo 表示一个待办事项
type Todo struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	Category    string    `json:"category" gorm:"not null;default:'normal'"` // normal, shopping, study, work
	Status      string    `json:"status" gorm:"not null;default:'pending'"`  // pending, completed, deleted
	Priority    int       `json:"priority" gorm:"not null;default:1"`        // 1: 低, 2: 中, 3: 高
	DueDate     time.Time `json:"due_date,omitempty"`
	CreatedAt   time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt   time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

// TodoStatus 定义了待办事项的状态
type TodoStatus string

const (
	TodoStatusPending   TodoStatus = "pending"
	TodoStatusCompleted TodoStatus = "completed"
	TodoStatusDeleted   TodoStatus = "deleted"
)

// TodoCategory 定义了待办事项的类别
type TodoCategory string

const (
	TodoCategoryNormal   TodoCategory = "normal"
	TodoCategoryShopping TodoCategory = "shopping"
	TodoCategoryStudy    TodoCategory = "study"
	TodoCategoryWork     TodoCategory = "work"
)

// Priority 定义了待办事项的优先级
type Priority int

const (
	PriorityLow    Priority = 1
	PriorityMedium Priority = 2
	PriorityHigh   Priority = 3
)

// NewTodo 创建一个新的待办事项
func NewTodo(title, description string, category TodoCategory, priority int, dueDate *time.Time) *Todo {
	todo := &Todo{
		Title:       title,
		Description: description,
		Category:    string(category),
		Status:      string(TodoStatusPending),
		Priority:    priority,
	}

	if dueDate != nil {
		todo.DueDate = *dueDate
	}

	return todo
}

// MarkAsCompleted 将待办事项标记为已完成
func (t *Todo) MarkAsCompleted() {
	t.Status = string(TodoStatusCompleted)
}

// MarkAsDeleted 将待办事项标记为已删除
func (t *Todo) MarkAsDeleted() {
	t.Status = string(TodoStatusDeleted)
}

// Update 更新待办事项信息
func (t *Todo) Update(title, description string, category TodoCategory, priority int, dueDate *time.Time) {
	t.Title = title
	t.Description = description
	t.Category = string(category)
	t.Priority = priority

	if dueDate != nil {
		t.DueDate = *dueDate
	}
}

package handlers

import (
	"net/http"
	"strconv"

	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"

	"github.com/gin-gonic/gin"
)

type TaskHandler struct {
	taskService *repository.TaskRepository
}

func NewTaskHandler(taskService *repository.TaskRepository) *TaskHandler {
	return &TaskHandler{taskService: taskService}
}

// CreateTask godoc
// @Summary 创建新任务
// @Description 创建一个新的任务
// @Tags tasks
// @Accept json
// @Produce json
// @Param task body models.Task true "任务信息"
// @Success 201 {object} models.Task
// @Router /tasks [post]
func (h *TaskHandler) CreateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.UserID = c.GetInt("userID")

	if err := h.taskService.Create(c.Request.Context(), &task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// ListTasks godoc
// @Summary 获取任务列表
// @Description 获取所有任务或按状态筛选的任务列表
// @Tags tasks
// @Produce json
// @Param status query string false "任务状态"
// @Success 200 {array} models.Task
// @Router /tasks [get]
func (h *TaskHandler) ListTasks(c *gin.Context) {
	userID := c.GetInt("userID")
	tasks, err := h.taskService.List(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// UpdateTask godoc
// @Summary 更新任务
// @Description 更新指定任务的信息
// @Tags tasks
// @Accept json
// @Produce json
// @Param id path int true "任务ID"
// @Param task body models.Task true "更新的任务信息"
// @Success 200 {object} models.Task
// @Router /tasks/{id} [put]
func (h *TaskHandler) UpdateTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task.UserID = c.GetInt("userID")

	if err := h.taskService.Update(c.Request.Context(), id, &task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, task)
}

// DeleteTask godoc
// @Summary 删除任务
// @Description 删除指定的任务
// @Tags tasks
// @Produce json
// @Param id path int true "任务ID"
// @Success 200 {object} string
// @Router /tasks/{id} [delete]
func (h *TaskHandler) DeleteTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	userID := c.GetInt("userID")

	if err := h.taskService.Delete(c.Request.Context(), id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

// GetTodayTasks 获取今日任务
func (h *TaskHandler) GetTodayTasks(c *gin.Context) {
	userID := c.GetInt("userID")

	tasks, err := h.taskService.GetTodayTasks(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GetTaskStats 获取任务统计信息
func (h *TaskHandler) GetTaskStats(c *gin.Context) {
	userID := c.GetInt("userID")

	stats, err := h.taskService.GetTaskStats(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetTask godoc
// @Summary 获取任务详情
// @Description 获取指定任务的详细信息
// @Tags tasks
// @Produce json
// @Param id path int true "任务ID"
// @Success 200 {object} models.Task
// @Router /tasks/{id} [get]
func (h *TaskHandler) GetTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	userID := c.GetInt("userID")

	task, err := h.taskService.GetByID(c.Request.Context(), id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	c.JSON(http.StatusOK, task)
}

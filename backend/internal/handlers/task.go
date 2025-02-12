package handlers

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type TaskHandler struct {
	taskService *services.TaskService
}

func NewTaskHandler(taskService *services.TaskService) *TaskHandler {
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
	fmt.Println("\n=== CreateTask handler called ===")
	fmt.Printf("请求头: %+v\n", c.Request.Header)

	// 检查认证头
	authHeader := c.GetHeader("Authorization")
	fmt.Printf("认证头: %s\n", authHeader)

	// 检查上下文中的用户信息
	userIDInterface, exists := c.Get("user_id")
	fmt.Printf("上下文中是否存在 user_id: %v\n", exists)
	if !exists {
		fmt.Println("错误: 上下文中未找到 user_id")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	fmt.Printf("上下文中的 user_id 类型: %T, 值: %v\n", userIDInterface, userIDInterface)
	userID, ok := userIDInterface.(uint)
	if !ok {
		fmt.Printf("错误: user_id 类型转换失败，实际类型: %T\n", userIDInterface)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	if userID == 0 {
		fmt.Println("错误: user_id 为 0")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID: cannot be 0"})
		return
	}

	fmt.Printf("转换后的 user_id: %v (类型: %T)\n", userID, userID)

	// 读取并打印原始请求体
	body, err := c.GetRawData()
	if err != nil {
		fmt.Printf("读取请求体失败: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}
	fmt.Printf("原始请求体: %s\n", string(body))

	// 重新设置请求体，因为 GetRawData 会消耗它
	c.Request.Body = io.NopCloser(bytes.NewBuffer(body))

	// 直接使用 models.Task 结构体接收数据
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		fmt.Printf("JSON 绑定错误: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 设置 user_id
	task.UserID = userID

	fmt.Printf("创建前的完整任务数据: %+v\n", task)
	fmt.Printf("特别检查 UserID 字段 - 类型: %T, 值: %v\n", task.UserID, task.UserID)

	// 打印 task 的所有字段
	fmt.Printf("Task 详细信息:\n")
	fmt.Printf("  ID: %v\n", task.ID)
	fmt.Printf("  UserID: %v\n", task.UserID)
	fmt.Printf("  Title: %v\n", task.Title)
	fmt.Printf("  Description: %v\n", task.Description)
	fmt.Printf("  Status: %v\n", task.Status)
	fmt.Printf("  Priority: %v\n", task.Priority)
	fmt.Printf("  Category: %v\n", task.Category)
	fmt.Printf("  DueDate: %v\n", task.DueDate)
	fmt.Printf("  CreatedAt: %v\n", task.CreatedAt)
	fmt.Printf("  UpdatedAt: %v\n", task.UpdatedAt)

	if err := h.taskService.CreateTask(&task); err != nil {
		fmt.Printf("创建任务时发生错误: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Printf("任务创建成功，返回数据: %+v\n", task)
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
	status := c.Query("status")
	userID := c.GetUint("user_id")
	tasks, err := h.taskService.ListTasks(userID, status)
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
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetUint("user_id")
	if err := h.taskService.UpdateTask(uint(id), userID, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task updated successfully"})
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
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	userID := c.GetUint("user_id")
	if err := h.taskService.DeleteTask(uint(id), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}

// GetTodayTasks 获取今日任务
func (h *TaskHandler) GetTodayTasks(c *gin.Context) {
	userID := c.GetUint("user_id")
	tasks, err := h.taskService.GetTodayTasks(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取今日任务失败"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GetTaskStats 获取任务统计信息
func (h *TaskHandler) GetTaskStats(c *gin.Context) {
	userID := c.GetUint("user_id")
	stats, err := h.taskService.GetTaskStats(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取统计信息失败"})
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
	fmt.Println("\n=== GetTask handler called ===")
	fmt.Printf("请求头: %+v\n", c.Request.Header)

	// 检查认证头
	authHeader := c.GetHeader("Authorization")
	fmt.Printf("认证头: %s\n", authHeader)

	// 检查上下文中的用户信息
	userIDInterface, exists := c.Get("user_id")
	fmt.Printf("上下文中是否存在 user_id: %v\n", exists)
	if !exists {
		fmt.Println("错误: 上下文中未找到 user_id")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not authenticated"})
		return
	}

	fmt.Printf("上下文中的 user_id 类型: %T, 值: %v\n", userIDInterface, userIDInterface)

	// 解析任务 ID
	taskID := c.Param("id")
	fmt.Printf("请求的任务 ID: %s\n", taskID)

	id, err := strconv.ParseUint(taskID, 10, 32)
	if err != nil {
		fmt.Printf("任务 ID 解析失败: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	userID := c.GetUint("user_id")
	fmt.Printf("获取到的 user_id: %v\n", userID)

	task, err := h.taskService.GetTask(uint(id), userID)
	if err != nil {
		fmt.Printf("获取任务失败: %v\n", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}

	fmt.Printf("成功获取任务: %+v\n", task)
	c.JSON(http.StatusOK, task)
}

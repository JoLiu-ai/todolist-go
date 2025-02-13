package handlers

import (
	"net/http"
	"strconv"

	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type KnowledgeHandler struct {
	service services.KnowledgeService
}

func NewKnowledgeHandler(service services.KnowledgeService) *KnowledgeHandler {
	return &KnowledgeHandler{service: service}
}

// CreateKnowledge godoc
// @Summary 创建知识条目
// @Description 创建一个新的知识条目
// @Tags knowledge
// @Accept json
// @Produce json
// @Param knowledge body models.Knowledge true "知识条目信息"
// @Success 201 {object} models.Knowledge
// @Router /knowledge [post]
func (h *KnowledgeHandler) CreateKnowledge(c *gin.Context) {
	var knowledge models.Knowledge
	if err := c.ShouldBindJSON(&knowledge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	knowledge.UserID = c.GetInt("userID")

	if err := h.service.Create(c.Request.Context(), &knowledge); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, knowledge)
}

// GetKnowledge godoc
// @Summary 获取知识条目
// @Description 获取指定ID的知识条目
// @Tags knowledge
// @Produce json
// @Param id path int true "知识条目ID"
// @Success 200 {object} models.Knowledge
// @Router /knowledge/{id} [get]
func (h *KnowledgeHandler) GetKnowledge(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid knowledge ID"})
		return
	}

	knowledge, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Knowledge not found"})
		return
	}

	c.JSON(http.StatusOK, knowledge)
}

// ListKnowledge godoc
// @Summary 获取知识列表
// @Description 获取当前用户的所有知识条目
// @Tags knowledge
// @Produce json
// @Success 200 {array} models.Knowledge
// @Router /knowledge [get]
func (h *KnowledgeHandler) ListKnowledge(c *gin.Context) {
	userID := c.GetInt("userID")

	knowledge, err := h.service.List(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, knowledge)
}

// UpdateKnowledge godoc
// @Summary 更新知识条目
// @Description 更新指定ID的知识条目
// @Tags knowledge
// @Accept json
// @Produce json
// @Param id path int true "知识条目ID"
// @Param knowledge body models.Knowledge true "更新的知识条目信息"
// @Success 200 {object} models.Knowledge
// @Router /knowledge/{id} [put]
func (h *KnowledgeHandler) UpdateKnowledge(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid knowledge ID"})
		return
	}

	var knowledge models.Knowledge
	if err := c.ShouldBindJSON(&knowledge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	knowledge.ID = id
	knowledge.UserID = c.GetInt("userID")

	if err := h.service.Update(c.Request.Context(), id, &knowledge); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, knowledge)
}

// DeleteKnowledge godoc
// @Summary 删除知识条目
// @Description 删除指定ID的知识条目
// @Tags knowledge
// @Produce json
// @Param id path int true "知识条目ID"
// @Success 200 {object} string
// @Router /knowledge/{id} [delete]
func (h *KnowledgeHandler) DeleteKnowledge(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid knowledge ID"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Knowledge deleted successfully"})
}

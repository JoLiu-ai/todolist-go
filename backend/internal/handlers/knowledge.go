package handlers

import (
	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type KnowledgeHandler struct {
	repo *repository.KnowledgeRepository
}

func NewKnowledgeHandler(repo *repository.KnowledgeRepository) *KnowledgeHandler {
	return &KnowledgeHandler{repo: repo}
}

func (h *KnowledgeHandler) CreateKnowledge(c *gin.Context) {
	var knowledge models.Knowledge
	if err := c.ShouldBindJSON(&knowledge); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	knowledge.UserID = c.GetInt("user_id")

	if err := h.repo.Create(c.Request.Context(), &knowledge); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, knowledge)
}

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

	knowledge.UserID = c.GetInt("user_id")

	if err := h.repo.Update(c.Request.Context(), id, &knowledge); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, knowledge)
}

func (h *KnowledgeHandler) DeleteKnowledge(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid knowledge ID"})
		return
	}

	userID := c.GetInt("user_id")

	if err := h.repo.Delete(c.Request.Context(), id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Knowledge deleted successfully"})
}

func (h *KnowledgeHandler) GetKnowledge(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid knowledge ID"})
		return
	}

	userID := c.GetInt("user_id")

	knowledge, err := h.repo.GetByID(c.Request.Context(), id, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, knowledge)
}

func (h *KnowledgeHandler) ListKnowledge(c *gin.Context) {
	userID := c.GetInt("user_id")
	category := c.Query("category")

	knowledge, err := h.repo.List(c.Request.Context(), userID, category)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, knowledge)
}

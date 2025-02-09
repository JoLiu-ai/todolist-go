package handlers

import (
	"net/http"
	"strconv"

	"cute-todo/backend/internal/core/services"

	"github.com/gin-gonic/gin"
)

type TagHandler struct {
	service *services.TagService
}

func NewTagHandler(service *services.TagService) *TagHandler {
	return &TagHandler{service: service}
}

func (h *TagHandler) RegisterRoutes(r *gin.RouterGroup) {
	r.GET("/tags", h.GetAllTags)
	r.POST("/tags", h.CreateTag)
	r.PUT("/tags/:id", h.UpdateTag)
	r.DELETE("/tags/:id", h.DeleteTag)
	r.GET("/media/:mediaId/tags", h.GetMediaTags)
	r.POST("/media/:mediaId/tags/:tagId", h.AddMediaTag)
	r.DELETE("/media/:mediaId/tags/:tagId", h.RemoveMediaTag)
}

type createTagRequest struct {
	Name string `json:"name"`
}

type updateTagRequest struct {
	Name string `json:"name"`
}

func (h *TagHandler) GetAllTags(c *gin.Context) {
	tags, err := h.service.GetAllTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tags)
}

func (h *TagHandler) CreateTag(c *gin.Context) {
	var req createTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.CreateTag(req.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 创建成功后获取最新的标签列表
	tags, err := h.service.GetAllTags()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, tags)
}

func (h *TagHandler) UpdateTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	var req updateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 先获取现有的标签
	tag, err := h.service.GetTagByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 更新标签名称
	tag.Name = req.Name
	err = h.service.UpdateTag(tag)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tag)
}

func (h *TagHandler) DeleteTag(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	if err := h.service.DeleteTag(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *TagHandler) GetMediaTags(c *gin.Context) {
	mediaIDStr := c.Param("mediaId")
	mediaID, err := strconv.ParseUint(mediaIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid media id"})
		return
	}

	tags, err := h.service.GetTagsByMediaID(uint(mediaID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tags)
}

func (h *TagHandler) AddMediaTag(c *gin.Context) {
	mediaIDStr := c.Param("mediaId")
	mediaID, err := strconv.ParseUint(mediaIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid media id"})
		return
	}

	tagIDStr := c.Param("tagId")
	tagID, err := strconv.ParseUint(tagIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	if err := h.service.AddTagToMedia(uint(mediaID), uint(tagID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusCreated)
}

func (h *TagHandler) RemoveMediaTag(c *gin.Context) {
	mediaIDStr := c.Param("mediaId")
	mediaID, err := strconv.ParseUint(mediaIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid media id"})
		return
	}

	tagIDStr := c.Param("tagId")
	tagID, err := strconv.ParseUint(tagIDStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	if err := h.service.RemoveTagFromMedia(uint(mediaID), uint(tagID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

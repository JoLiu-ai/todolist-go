package handlers

import (
	"net/http"
	"strconv"

	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MediaHandler struct {
	service ports.MediaService
	db      *gorm.DB
}

func NewMediaHandler(service ports.MediaService, db *gorm.DB) *MediaHandler {
	return &MediaHandler{service: service, db: db}
}

func (h *MediaHandler) List(c *gin.Context) {
	var filter ports.MediaFilter
	// 从查询参数构建过滤条件
	if mediaType := c.Query("type"); mediaType != "" {
		t := domain.MediaType(mediaType)
		filter.Type = &t
	}
	if status := c.Query("status"); status != "" {
		s := domain.MediaStatus(status)
		filter.Status = &s
	}
	if title := c.Query("title"); title != "" {
		filter.Title = &title
	}
	if creator := c.Query("creator"); creator != "" {
		filter.Creator = &creator
	}
	if rating := c.Query("rating"); rating != "" {
		if r, err := strconv.ParseFloat(rating, 32); err == nil {
			r32 := float32(r)
			filter.Rating = &r32
		}
	}
	if tags := c.QueryArray("tags"); len(tags) > 0 {
		filter.Tags = tags
	}

	// 分页
	if page := c.Query("page"); page != "" {
		if p, err := strconv.Atoi(page); err == nil && p > 0 {
			filter.Page = p
		}
	}
	if pageSize := c.Query("pageSize"); pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil && ps > 0 {
			filter.PageSize = ps
		}
	}

	// 排序
	filter.SortBy = c.Query("sortBy")
	filter.SortDesc = c.Query("sortDesc") == "true"

	medias, err := h.service.List(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	count, err := h.service.Count(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":     medias,
		"total":    count,
		"page":     filter.Page,
		"pageSize": filter.PageSize,
	})
}

func (h *MediaHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	media, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": media,
	})
}

func (h *MediaHandler) Create(c *gin.Context) {
	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if err := h.service.Create(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": media,
	})
}

func (h *MediaHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	media.ID = uint(id)
	if err := h.service.Update(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": media,
	})
}

func (h *MediaHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *MediaHandler) AddNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var note domain.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	note.MediaID = uint(mediaID)
	if err := h.service.AddNote(c.Request.Context(), uint(mediaID), &note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": note,
	})
}

func (h *MediaHandler) UpdateNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("mediaId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	noteID, err := strconv.ParseUint(c.Param("noteId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	var note domain.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	note.ID = uint(noteID)
	note.MediaID = uint(mediaID)
	if err := h.service.UpdateNote(c.Request.Context(), uint(mediaID), &note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": note,
	})
}

func (h *MediaHandler) DeleteNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("mediaId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	noteID, err := strconv.ParseUint(c.Param("noteId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	if err := h.service.DeleteNote(c.Request.Context(), uint(mediaID), uint(noteID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func (h *MediaHandler) GetAll(c *gin.Context) {
	// 实现获取所有媒体列表的逻辑
}

// GetMediaList 获取媒体列表，支持按类型筛选
func (h *MediaHandler) GetMediaList(c *gin.Context) {
	var filter ports.MediaFilter
	// 从查询参数构建过滤条件
	if mediaType := c.Query("type"); mediaType != "" {
		t := domain.MediaType(mediaType)
		filter.Type = &t
	}

	userID := c.GetUint("user_id") // 从JWT中获取
	filter.UserID = &userID

	medias, err := h.service.List(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	count, err := h.service.Count(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":     medias,
		"total":    count,
		"page":     filter.Page,
		"pageSize": filter.PageSize,
	})
}

// GetMediaByID 获取单个媒体详情
func (h *MediaHandler) GetMediaByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	userID := c.GetUint("user_id")
	media, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 检查是否是用户自己的媒体
	if media.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": media,
	})
}

// CreateMedia 创建新的媒体
func (h *MediaHandler) CreateMedia(c *gin.Context) {
	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	media.UserID = c.GetUint("user_id")
	if err := h.service.Create(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"data": media,
	})
}

// UpdateMedia 更新媒体信息
func (h *MediaHandler) UpdateMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	userID := c.GetUint("user_id")
	existingMedia, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Media not found"})
		return
	}

	// 检查是否是用户自己的媒体
	if existingMedia.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	media.ID = uint(id)
	media.UserID = userID
	if err := h.service.Update(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": media,
	})
}

// DeleteMedia 删除媒体
func (h *MediaHandler) DeleteMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	userID := c.GetUint("user_id")
	existingMedia, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Media not found"})
		return
	}

	// 检查是否是用户自己的媒体
	if existingMedia.UserID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

package handlers

import (
	"net/http"
	"strconv"

	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"
	"cute-todo/backend/internal/core/services"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	service *services.MediaService
}

func NewMediaHandler(service *services.MediaService) *MediaHandler {
	return &MediaHandler{service: service}
}

// RegisterRoutes 注册路由
func (h *MediaHandler) RegisterRoutes(r *gin.Engine) {
	v1 := r.Group("/api/v1")
	{
		media := v1.Group("/media")
		{
			media.POST("", h.CreateMedia)
			media.GET("", h.ListMedia)
			media.GET("/:id", h.GetMedia)
			media.PUT("/:id", h.UpdateMedia)
			media.DELETE("/:id", h.DeleteMedia)

			// Add note endpoints
			media.GET("/:id/notes", h.GetNotes)
			media.POST("/:id/notes", h.CreateNote)
			media.PUT("/:id/notes/:noteId", h.UpdateNote)
			media.DELETE("/:id/notes/:noteId", h.DeleteNote)
		}
	}
}

// CreateMedia 创建新的媒体项目
func (h *MediaHandler) CreateMedia(c *gin.Context) {
	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.Create(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, media)
}

// ListMedia 获取媒体列表
func (h *MediaHandler) ListMedia(c *gin.Context) {
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

	c.JSON(http.StatusOK, medias)
}

// GetMedia 获取单个媒体项目
func (h *MediaHandler) GetMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	media, err := h.service.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, media)
}

// UpdateMedia 更新媒体项目
func (h *MediaHandler) UpdateMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var media domain.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	media.ID = uint(id)
	if err := h.service.Update(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, media)
}

// DeleteMedia 删除媒体项目
func (h *MediaHandler) DeleteMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	if err := h.service.Delete(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

// GetNotes 获取媒体的所有笔记
func (h *MediaHandler) GetNotes(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	// 获取分页参数
	page := 1
	pageSize := 10
	if p := c.Query("page"); p != "" {
		if pInt, err := strconv.Atoi(p); err == nil && pInt > 0 {
			page = pInt
		}
	}
	if ps := c.Query("pageSize"); ps != "" {
		if psInt, err := strconv.Atoi(ps); err == nil && psInt > 0 {
			pageSize = psInt
		}
	}

	// 获取笔记总数
	total, err := h.service.CountNotes(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 获取分页笔记数据
	notes, err := h.service.GetNotes(c.Request.Context(), uint(id), page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"notes":    notes,
		"total":    total,
		"page":     page,
		"pageSize": pageSize,
	})
}

// CreateNote 创建新笔记
func (h *MediaHandler) CreateNote(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var note domain.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.AddNote(c.Request.Context(), uint(id), &note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, note)
}

// UpdateNote 更新笔记
func (h *MediaHandler) UpdateNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid media id"})
		return
	}

	noteID, err := strconv.ParseUint(c.Param("noteId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}

	var note domain.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note.ID = uint(noteID)
	if err := h.service.UpdateNote(c.Request.Context(), uint(mediaID), &note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, note)
}

// DeleteNote 删除笔记
func (h *MediaHandler) DeleteNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid media id"})
		return
	}

	noteID, err := strconv.ParseUint(c.Param("noteId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}

	if err := h.service.DeleteNote(c.Request.Context(), uint(mediaID), uint(noteID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

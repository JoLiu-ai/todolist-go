package handlers

import (
	"net/http"
	"strconv"
	"time"

	"cute-todo/backend/internal/services"
	"cute-todo/backend/models"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	mediaService services.MediaService
}

func NewMediaHandler(mediaService services.MediaService) *MediaHandler {
	return &MediaHandler{mediaService: mediaService}
}

// CreateMedia godoc
// @Summary 创建媒体项
// @Description 创建一个新的媒体项（书籍、电影等）
// @Tags media
// @Accept json
// @Produce json
// @Param media body models.Media true "媒体信息"
// @Success 201 {object} models.Media
// @Router /media [post]
func (h *MediaHandler) CreateMedia(c *gin.Context) {
	var media models.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	media.UserID = c.GetUint("user_id")

	if err := h.mediaService.Create(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, media)
}

// GetMedia godoc
// @Summary 获取媒体项
// @Description 获取指定ID的媒体项
// @Tags media
// @Produce json
// @Param id path int true "媒体ID"
// @Success 200 {object} models.Media
// @Router /media/{id} [get]
func (h *MediaHandler) GetMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	media, err := h.mediaService.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Media not found"})
		return
	}

	c.JSON(http.StatusOK, media)
}

// ListMedia godoc
// @Summary 获取媒体列表
// @Description 获取媒体列表，支持过滤和分页
// @Tags media
// @Produce json
// @Param type query string false "媒体类型"
// @Param status query string false "状态"
// @Param title query string false "标题"
// @Param creator query string false "创作者"
// @Param rating query number false "最低评分"
// @Param page query int false "页码"
// @Param page_size query int false "每页数量"
// @Success 200 {array} models.Media
// @Router /media [get]
func (h *MediaHandler) ListMedia(c *gin.Context) {
	var filter models.MediaFilter
	filter.UserID = new(uint)
	*filter.UserID = c.GetUint("user_id")

	// 解析查询参数
	if typeStr := c.Query("type"); typeStr != "" {
		filter.Type = &typeStr
	}
	if status := c.Query("status"); status != "" {
		filter.Status = &status
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

	// 解析分页参数
	if page := c.Query("page"); page != "" {
		if p, err := strconv.Atoi(page); err == nil && p > 0 {
			filter.Page = p
		}
	}
	if pageSize := c.Query("page_size"); pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil && ps > 0 {
			filter.PageSize = ps
		}
	}

	// 获取数据
	medias, err := h.mediaService.List(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 获取总数
	total, err := h.mediaService.Count(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": medias,
		"total": total,
		"page":  filter.Page,
		"size":  filter.PageSize,
	})
}

// UpdateMedia godoc
// @Summary 更新媒体项
// @Description 更新指定ID的媒体项
// @Tags media
// @Accept json
// @Produce json
// @Param id path int true "媒体ID"
// @Param media body models.Media true "更新的媒体信息"
// @Success 200 {object} models.Media
// @Router /media/{id} [put]
func (h *MediaHandler) UpdateMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var media models.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	media.ID = uint(id)
	media.UserID = c.GetUint("user_id")

	if err := h.mediaService.Update(c.Request.Context(), &media); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, media)
}

// DeleteMedia godoc
// @Summary 删除媒体项
// @Description 删除指定ID的媒体项
// @Tags media
// @Produce json
// @Param id path int true "媒体ID"
// @Success 200 {object} string
// @Router /media/{id} [delete]
func (h *MediaHandler) DeleteMedia(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	if err := h.mediaService.Delete(c.Request.Context(), uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Media deleted successfully"})
}

// GetHomeData godoc
// @Summary 获取首页数据
// @Description 获取首页需要展示的媒体数据
// @Tags media
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /media/home [get]
func (h *MediaHandler) GetHomeData(c *gin.Context) {
	userID := c.GetUint("user_id")

	// 获取最近添加的媒体
	recentFilter := models.MediaFilter{
		UserID:   &userID,
		Page:     1,
		PageSize: 5,
		SortBy:   "created_at",
		SortDesc: true,
	}
	recentMedia, err := h.mediaService.List(c.Request.Context(), recentFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get recent media"})
		return
	}

	// 获取高评分的媒体
	ratingFilter := models.MediaFilter{
		UserID:   &userID,
		Page:     1,
		PageSize: 5,
		SortBy:   "rating",
		SortDesc: true,
	}
	topRatedMedia, err := h.mediaService.List(c.Request.Context(), ratingFilter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get top rated media"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recent_media": recentMedia,
		"top_rated":    topRatedMedia,
	})
}

// GetMediaList godoc
// @Summary 获取媒体列表
// @Description 获取媒体列表，支持过滤和分页
// @Tags media
// @Produce json
// @Param type query string false "媒体类型"
// @Param status query string false "状态"
// @Param title query string false "标题"
// @Param creator query string false "创作者"
// @Param rating query number false "最低评分"
// @Param page query int false "页码"
// @Param page_size query int false "每页数量"
// @Success 200 {array} models.Media
// @Router /media/list [get]
func (h *MediaHandler) GetMediaList(c *gin.Context) {
	var filter models.MediaFilter
	filter.UserID = new(uint)
	*filter.UserID = c.GetUint("user_id")

	// 解析查询参数
	if typeStr := c.Query("type"); typeStr != "" {
		filter.Type = &typeStr
	}
	if status := c.Query("status"); status != "" {
		filter.Status = &status
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

	// 解析分页参数
	if page := c.Query("page"); page != "" {
		if p, err := strconv.Atoi(page); err == nil && p > 0 {
			filter.Page = p
		}
	}
	if pageSize := c.Query("page_size"); pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil && ps > 0 {
			filter.PageSize = ps
		}
	}

	// 获取数据
	medias, err := h.mediaService.List(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// 获取总数
	total, err := h.mediaService.Count(c.Request.Context(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"items": medias,
		"total": total,
		"page":  filter.Page,
		"size":  filter.PageSize,
	})
}

// GetMediaByID godoc
// @Summary 获取媒体详情
// @Description 获取指定ID的媒体详情，包括笔记和详细信息
// @Tags media
// @Produce json
// @Param id path int true "媒体ID"
// @Success 200 {object} models.Media
// @Router /media/{id} [get]
func (h *MediaHandler) GetMediaByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	media, err := h.mediaService.GetByID(c.Request.Context(), uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Media not found"})
		return
	}

	// 获取笔记
	notes, err := h.mediaService.GetNotes(c.Request.Context(), uint(id), 1, 100)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get notes"})
		return
	}

	// 根据媒体类型获取详细信息
	var details interface{}
	switch media.Type {
	case "book":
		details, err = h.mediaService.GetBookDetails(c.Request.Context(), uint(id))
	case "movie":
		details, err = h.mediaService.GetMovieDetails(c.Request.Context(), uint(id))
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get details"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"media":   media,
		"notes":   notes,
		"details": details,
	})
}

// AddNote godoc
// @Summary 添加笔记
// @Description 为指定的媒体添加笔记
// @Tags media
// @Accept json
// @Produce json
// @Param id path int true "媒体ID"
// @Param note body models.Note true "笔记内容"
// @Success 201 {object} models.Note
// @Router /media/{id}/notes [post]
func (h *MediaHandler) AddNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var note models.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note.MediaID = uint(mediaID)
	note.CreatedAt = time.Now()
	note.UpdatedAt = time.Now()

	if err := h.mediaService.CreateNote(c.Request.Context(), uint(mediaID), &note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, note)
}

// UpdateNote godoc
// @Summary 更新笔记
// @Description 更新指定的笔记
// @Tags media
// @Accept json
// @Produce json
// @Param id path int true "媒体ID"
// @Param note_id path int true "笔记ID"
// @Param note body models.Note true "更新的笔记内容"
// @Success 200 {object} models.Note
// @Router /media/{id}/notes/{note_id} [put]
func (h *MediaHandler) UpdateNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var note models.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note.MediaID = uint(mediaID)
	note.UpdatedAt = time.Now()

	if err := h.mediaService.UpdateNote(c.Request.Context(), uint(mediaID), &note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, note)
}

// DeleteNote godoc
// @Summary 删除笔记
// @Description 删除指定的笔记
// @Tags media
// @Produce json
// @Param id path int true "媒体ID"
// @Param note_id path int true "笔记ID"
// @Success 200 {object} string
// @Router /media/{id}/notes/{note_id} [delete]
func (h *MediaHandler) DeleteNote(c *gin.Context) {
	mediaID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	noteID, err := strconv.ParseUint(c.Param("note_id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	if err := h.mediaService.DeleteNote(c.Request.Context(), uint(mediaID), uint(noteID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
}

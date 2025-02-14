package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime/debug"
	"strconv"
	"time"

	"cute-todo/backend/internal/models"
	"cute-todo/backend/internal/repository"
	"cute-todo/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type MediaHandler struct {
	mediaService services.MediaService
	repo         *repository.MediaRepository
}

func NewMediaHandler(mediaService services.MediaService, repo *repository.MediaRepository) *MediaHandler {
	return &MediaHandler{mediaService: mediaService, repo: repo}
}

// 添加错误处理辅助函数
func handleError(c *gin.Context, err error, status int) {
	debugMode := os.Getenv("DEBUG_MODE") == "true"

	if debugMode {
		// 在调试模式下，返回详细的错误信息
		errorResponse := gin.H{
			"error": err.Error(),
			"stack": string(debug.Stack()),
			"debug_info": map[string]interface{}{
				"request_path":   c.Request.URL.Path,
				"request_method": c.Request.Method,
				"query_params":   c.Request.URL.Query(),
			},
		}
		c.JSON(status, errorResponse)
	} else {
		// 在生产模式下，返回用户友好的错误信息
		c.JSON(status, gin.H{"error": "操作失败，请稍后重试"})
	}
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
		log.Printf("[CreateMedia] JSON binding error: %+v", err)
		handleError(c, fmt.Errorf("invalid request data: %v", err), http.StatusBadRequest)
		return
	}

	// 打印接收到的请求数据
	log.Printf("[CreateMedia] Received request data: %+v", media)

	// 获取用户ID
	userID, exists := c.Get("userID")
	if !exists {
		log.Printf("[CreateMedia] User ID not found in context")
		handleError(c, errors.New("user not authenticated"), http.StatusUnauthorized)
		return
	}

	// 设置用户ID
	media.UserID = userID.(int)

	// 清除可能被客户端设置的时间字段，让 GORM 自动处理
	media.CreatedAt = time.Time{}
	media.UpdatedAt = time.Time{}

	// 验证必填字段
	if media.Type == "" {
		log.Printf("[CreateMedia] Missing required field: type")
		handleError(c, errors.New("type is required"), http.StatusBadRequest)
		return
	}
	if media.Title == "" {
		log.Printf("[CreateMedia] Missing required field: title")
		handleError(c, errors.New("title is required"), http.StatusBadRequest)
		return
	}
	if media.Status == "" {
		log.Printf("[CreateMedia] Missing required field: status")
		handleError(c, errors.New("status is required"), http.StatusBadRequest)
		return
	}

	// 验证类型值
	if media.Type != models.MediaTypeBook && media.Type != models.MediaTypeMovie {
		log.Printf("[CreateMedia] Invalid media type: %s", media.Type)
		handleError(c, fmt.Errorf("invalid media type: %s", media.Type), http.StatusBadRequest)
		return
	}

	// 验证状态值
	validStatuses := []string{models.StatusInProgress, models.StatusCompleted, models.StatusPlanToRead, models.StatusDropped}
	isValidStatus := false
	for _, status := range validStatuses {
		if media.Status == status {
			isValidStatus = true
			break
		}
	}
	if !isValidStatus {
		log.Printf("[CreateMedia] Invalid status: %s", media.Status)
		handleError(c, fmt.Errorf("invalid status: %s", media.Status), http.StatusBadRequest)
		return
	}

	// 创建媒体记录
	if err := h.mediaService.Create(c, &media); err != nil {
		log.Printf("[CreateMedia] Failed to create media: %+v", err)
		handleError(c, fmt.Errorf("failed to create media: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("[CreateMedia] Successfully created media with ID: %d", media.ID)
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
	log.Printf("[GetMedia] Request started - URL: %s", c.Request.URL.String())
	log.Printf("[GetMedia] Query parameters: %v", c.Request.URL.Query())

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Printf("[GetMedia] Invalid ID format: %v", err)
		handleError(c, fmt.Errorf("invalid media ID: %v", err), http.StatusBadRequest)
		return
	}

	userID := c.GetInt("userID")
	mediaType := c.Query("type")

	log.Printf("[GetMedia] Processing request - ID: %d, UserID: %d, MediaType: %s", id, userID, mediaType)

	// 验证媒体类型
	if mediaType != "" && mediaType != string(models.MediaTypeBook) && mediaType != string(models.MediaTypeMovie) {
		log.Printf("[GetMedia] Invalid media type: %s", mediaType)
		handleError(c, fmt.Errorf("invalid media type: %s", mediaType), http.StatusBadRequest)
		return
	}

	// 获取媒体基本信息
	media, err := h.mediaService.GetByID(c.Request.Context(), id, userID)
	if err != nil {
		log.Printf("[GetMedia] Failed to get media: %+v", err)
		handleError(c, fmt.Errorf("failed to get media: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("[GetMedia] Successfully retrieved media - ID: %d, Type: %s", media.ID, media.Type)

	// 如果指定了类型，验证媒体类型是否匹配
	if mediaType != "" && media.Type != mediaType {
		log.Printf("[GetMedia] Media type mismatch - Expected: %s, Got: %s", mediaType, media.Type)
		handleError(c, fmt.Errorf("media type mismatch: expected %s, got %s", mediaType, media.Type), http.StatusNotFound)
		return
	}

	// 获取笔记
	notes, err := h.mediaService.GetNotes(c.Request.Context(), id, 1, 10)
	if err != nil {
		log.Printf("[GetMedia] Failed to get notes: %v", err)
		notes = []*models.Note{} // 修复：使用正确的类型 []*models.Note
	} else {
		log.Printf("[GetMedia] Successfully retrieved %d notes", len(notes))
	}

	// 获取详细信息
	var details interface{}
	if media.Type == "book" {
		log.Printf("[GetMedia] Fetching book details for ID: %d", id)
		details, err = h.mediaService.GetBookDetails(c.Request.Context(), id)
	} else if media.Type == "movie" {
		log.Printf("[GetMedia] Fetching movie details for ID: %d", id)
		details, err = h.mediaService.GetMovieDetails(c.Request.Context(), id)
	}
	if err != nil {
		log.Printf("[GetMedia] Failed to get details: %v", err)
		details = map[string]interface{}{} // 使用空 map 而不是 nil
	} else {
		log.Printf("[GetMedia] Successfully retrieved details")
	}

	response := gin.H{
		"media":   media,
		"notes":   notes,
		"details": details,
	}
	log.Printf("[GetMedia] Sending response for ID: %d", id)
	c.JSON(http.StatusOK, response)
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
	userID := c.GetInt("userID")
	filter.UserID = &userID

	log.Printf("[ListMedia] User ID: %d", userID)

	// 解析查询参数
	if typeStr := c.Query("type"); typeStr != "" {
		filter.Type = &typeStr
		log.Printf("[ListMedia] Type filter: %s", typeStr)
	}
	if status := c.Query("status"); status != "" {
		filter.Status = &status
		log.Printf("[ListMedia] Status filter: %s", status)
	}
	if title := c.Query("title"); title != "" {
		filter.Title = &title
		log.Printf("[ListMedia] Title filter: %s", title)
	}
	if creator := c.Query("creator"); creator != "" {
		filter.Creator = &creator
		log.Printf("[ListMedia] Creator filter: %s", creator)
	}
	if rating := c.Query("rating"); rating != "" {
		if r, err := strconv.ParseFloat(rating, 32); err == nil {
			r32 := float32(r)
			filter.Rating = &r32
			log.Printf("[ListMedia] Rating filter: %f", r32)
		}
	}

	// 解析分页参数
	if page := c.Query("page"); page != "" {
		if p, err := strconv.Atoi(page); err == nil && p > 0 {
			filter.Page = p
			log.Printf("[ListMedia] Page: %d", p)
		}
	}
	if pageSize := c.Query("page_size"); pageSize != "" {
		if ps, err := strconv.Atoi(pageSize); err == nil && ps > 0 {
			filter.PageSize = ps
			log.Printf("[ListMedia] Page size: %d", ps)
		}
	}

	log.Printf("[ListMedia] Final filter: %+v", filter)

	// 获取数据
	medias, err := h.mediaService.List(c.Request.Context(), filter)
	if err != nil {
		log.Printf("[ListMedia] Error getting media list: %v", err)
		handleError(c, fmt.Errorf("failed to get media list: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("[ListMedia] Found %d media items", len(medias))

	// 获取总数
	total, err := h.mediaService.Count(c.Request.Context(), filter)
	if err != nil {
		log.Printf("[ListMedia] Error getting media count: %v", err)
		handleError(c, fmt.Errorf("failed to get media count: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("[ListMedia] Total count: %d", total)

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
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var media models.Media
	if err := c.ShouldBindJSON(&media); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	media.UserID = c.GetInt("userID")
	media.ID = id

	if err := h.mediaService.Update(c.Request.Context(), id, &media); err != nil {
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
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	userID := c.GetInt("userID")

	if err := h.mediaService.Delete(c.Request.Context(), id, userID); err != nil {
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
	userID := c.GetInt("userID")

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

	c.JSON(http.StatusOK, gin.H{
		"recent_media": recentMedia,
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
	log.Printf("[GetMediaByID] Request started - URL: %s", c.Request.URL.String())
	log.Printf("[GetMediaByID] Query parameters: %v", c.Request.URL.Query())
	log.Printf("[GetMediaByID] Headers: %v", c.Request.Header)

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		log.Printf("[GetMediaByID] Invalid ID format: %v", err)
		handleError(c, fmt.Errorf("invalid media ID: %v", err), http.StatusBadRequest)
		return
	}

	userID := c.GetInt("userID")
	log.Printf("[GetMediaByID] Processing request - ID: %d, UserID: %d", id, userID)

	media, err := h.mediaService.GetByID(c.Request.Context(), id, userID)
	if err != nil {
		log.Printf("[GetMediaByID] Failed to get media: %+v", err)
		handleError(c, fmt.Errorf("media not found: %v", err), http.StatusNotFound)
		return
	}
	log.Printf("[GetMediaByID] Successfully retrieved media - ID: %d, Type: %s", media.ID, media.Type)

	// 获取笔记
	notes, err := h.mediaService.GetNotes(c.Request.Context(), id, 1, 10)
	if err != nil {
		log.Printf("[GetMediaByID] Failed to get notes: %v", err)
		notes = []*models.Note{} // 使用空数组而不是返回错误
	} else {
		log.Printf("[GetMediaByID] Successfully retrieved %d notes", len(notes))
	}

	// 获取详细信息
	var details interface{}
	if media.Type == "book" {
		log.Printf("[GetMediaByID] Fetching book details for ID: %d", id)
		details, err = h.mediaService.GetBookDetails(c.Request.Context(), id)
		if err != nil {
			log.Printf("[GetMediaByID] Failed to get book details: %v", err)
			details = nil // 如果获取失败就不返回详情
		}
	} else if media.Type == "movie" {
		log.Printf("[GetMediaByID] Fetching movie details for ID: %d", id)
		details, err = h.mediaService.GetMovieDetails(c.Request.Context(), id)
		if err != nil {
			log.Printf("[GetMediaByID] Failed to get movie details: %v", err)
			details = nil // 如果获取失败就不返回详情
		}
	}

	response := gin.H{
		"media": media,
		"notes": notes,
	}

	// 只有在成功获取到详情时才添加到响应中
	if details != nil {
		response["details"] = details
	}

	log.Printf("[GetMediaByID] Sending response for ID: %d", id)
	c.JSON(http.StatusOK, response)
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
	mediaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var note models.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note.MediaID = mediaID

	if err := h.mediaService.CreateNote(c.Request.Context(), mediaID, &note); err != nil {
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
	mediaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	var note models.Note
	if err := c.ShouldBindJSON(&note); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	note.MediaID = mediaID

	if err := h.mediaService.UpdateNote(c.Request.Context(), mediaID, &note); err != nil {
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
	mediaID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid media ID"})
		return
	}

	noteID, err := strconv.Atoi(c.Param("note_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid note ID"})
		return
	}

	if err := h.mediaService.DeleteNote(c.Request.Context(), mediaID, noteID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Note deleted successfully"})
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
	userID := c.GetInt("userID")
	filter.UserID = &userID

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

// GetMediaStats godoc
// @Summary 获取媒体统计信息
// @Description 获取用户的媒体统计信息，包括书籍和电影的总数和进行中的数量
// @Tags media
// @Produce json
// @Success 200 {object} models.MediaStats
// @Router /media/stats [get]
func (h *MediaHandler) GetMediaStats(c *gin.Context) {
	userID := c.GetInt("userID")
	stats, err := h.mediaService.GetStats(c.Request.Context(), uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取统计信息失败"})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// GetRecentMedia godoc
// @Summary 获取最近的媒体
// @Description 获取用户最近添加或更新的媒体列表
// @Tags media
// @Produce json
// @Param limit query int false "返回数量限制"
// @Success 200 {array} models.Media
// @Router /media/recent [get]
func (h *MediaHandler) GetRecentMedia(c *gin.Context) {
	userID := c.GetInt("userID")
	limit := 5 // 默认返回5条
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	media, err := h.mediaService.GetRecent(c.Request.Context(), uint(userID), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "获取最近媒体失败"})
		return
	}
	c.JSON(http.StatusOK, media)
}

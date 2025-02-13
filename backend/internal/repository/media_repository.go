package repository

import (
	"context"
	"cute-todo/backend/internal/models"

	"gorm.io/gorm"
)

type MediaRepository struct {
	db *gorm.DB
}

func NewMediaRepository(db *gorm.DB) *MediaRepository {
	return &MediaRepository{db: db}
}

// 基础媒体操作
// =============

// Create 创建新的媒体记录
func (r *MediaRepository) Create(ctx context.Context, media *models.Media) error {
	return r.db.WithContext(ctx).Create(media).Error
}

// GetByID 根据ID和用户ID获取媒体记录
func (r *MediaRepository) GetByID(ctx context.Context, id, userID int) (*models.Media, error) {
	var media models.Media
	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		First(&media).Error
	if err != nil {
		return nil, err
	}
	return &media, nil
}

// Update 更新媒体记录
func (r *MediaRepository) Update(ctx context.Context, id int, media *models.Media) error {
	result := r.db.WithContext(ctx).Model(&models.Media{}).
		Where("id = ? AND user_id = ?", id, media.UserID).
		Updates(map[string]interface{}{
			"title":       media.Title,
			"description": media.Description,
			"type":        media.Type,
			"status":      media.Status,
			"rating":      media.Rating,
			"tags":        media.Tags,
			"creator":     media.Creator,
			"cover_image": media.CoverImage,
			"progress":    media.Progress,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete 删除媒体记录
func (r *MediaRepository) Delete(ctx context.Context, id, userID int) error {
	// 开启事务
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// 先获取媒体记录
		var media models.Media
		if err := tx.Where("id = ? AND user_id = ?", id, userID).First(&media).Error; err != nil {
			return err
		}

		// 根据媒体类型删除对应的详情记录
		if media.Type == "movie" {
			if err := tx.Where("media_id = ?", id).Delete(&models.MovieDetails{}).Error; err != nil {
				return err
			}
		} else if media.Type == "book" {
			if err := tx.Where("media_id = ?", id).Delete(&models.BookDetails{}).Error; err != nil {
				return err
			}
		}

		// 删除相关的笔记
		if err := tx.Where("media_id = ?", id).Delete(&models.Note{}).Error; err != nil {
			return err
		}

		// 最后删除媒体记录
		result := tx.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Media{})
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return gorm.ErrRecordNotFound
		}
		return nil
	})
}

// List 获取媒体列表，支持按类型筛选和通用过滤
func (r *MediaRepository) List(ctx context.Context, filter models.MediaFilter) ([]*models.Media, error) {
	var medias []*models.Media
	query := r.db.WithContext(ctx)

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("title LIKE ?", "%"+*filter.Title+"%")
	}
	if filter.Creator != nil {
		query = query.Where("creator LIKE ?", "%"+*filter.Creator+"%")
	}
	if filter.Rating != nil {
		query = query.Where("rating >= ?", *filter.Rating)
	}
	if len(filter.Tags) > 0 {
		query = query.Where("tags && ?", filter.Tags)
	}
	if filter.UserID != nil {
		query = query.Where("user_id = ?", *filter.UserID)
	}

	// 添加排序
	if filter.SortBy != "" {
		if filter.SortDesc {
			query = query.Order(filter.SortBy + " DESC")
		} else {
			query = query.Order(filter.SortBy)
		}
	} else {
		query = query.Order("created_at DESC")
	}

	// 添加分页
	if filter.Page > 0 && filter.PageSize > 0 {
		offset := (filter.Page - 1) * filter.PageSize
		query = query.Offset(offset).Limit(filter.PageSize)
	}

	err := query.Find(&medias).Error
	return medias, err
}

// Count 获取符合条件的媒体记录总数
func (r *MediaRepository) Count(ctx context.Context, filter models.MediaFilter) (int64, error) {
	var count int64
	query := r.db.WithContext(ctx).Model(&models.Media{})

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("title LIKE ?", "%"+*filter.Title+"%")
	}
	if filter.Creator != nil {
		query = query.Where("creator LIKE ?", "%"+*filter.Creator+"%")
	}
	if filter.Rating != nil {
		query = query.Where("rating >= ?", *filter.Rating)
	}
	if len(filter.Tags) > 0 {
		query = query.Where("tags && ?", filter.Tags)
	}
	if filter.UserID != nil {
		query = query.Where("user_id = ?", *filter.UserID)
	}

	return count, query.Count(&count).Error
}

// 笔记相关操作
// =============

// GetNotes 获取媒体的笔记列表
func (r *MediaRepository) GetNotes(ctx context.Context, mediaID int, page, pageSize int) ([]*models.Note, error) {
	var notes []*models.Note
	offset := (page - 1) * pageSize
	err := r.db.WithContext(ctx).
		Where("media_id = ?", mediaID).
		Order("created_at desc").
		Offset(offset).
		Limit(pageSize).
		Find(&notes).Error
	return notes, err
}

// CountNotes 获取媒体的笔记总数
func (r *MediaRepository) CountNotes(ctx context.Context, mediaID int) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Note{}).
		Where("media_id = ?", mediaID).
		Count(&count).Error
	return count, err
}

// CreateNote 创建笔记
func (r *MediaRepository) CreateNote(ctx context.Context, mediaID int, note *models.Note) error {
	// 检查媒体是否存在
	var media models.Media
	if err := r.db.WithContext(ctx).
		Where("id = ?", mediaID).
		First(&media).Error; err != nil {
		return err
	}

	note.MediaID = mediaID
	return r.db.WithContext(ctx).Create(note).Error
}

// UpdateNote 更新笔记
func (r *MediaRepository) UpdateNote(ctx context.Context, mediaID int, note *models.Note) error {
	result := r.db.WithContext(ctx).Model(&models.Note{}).
		Where("id = ? AND media_id = ?", note.ID, mediaID).
		Updates(map[string]interface{}{
			"content": note.Content,
			"page":    note.Page,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// DeleteNote 删除笔记
func (r *MediaRepository) DeleteNote(ctx context.Context, mediaID, noteID int) error {
	result := r.db.WithContext(ctx).
		Where("id = ? AND media_id = ?", noteID, mediaID).
		Delete(&models.Note{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// 统计和首页数据
// =============

// GetStats 获取用户的媒体统计信息
func (r *MediaRepository) GetStats(ctx context.Context, userID uint) (*models.MediaStats, error) {
	var stats models.MediaStats

	// 获取书籍总数
	if err := r.db.WithContext(ctx).Model(&models.Media{}).
		Where("user_id = ? AND type = ?", userID, models.MediaTypeBook).
		Count(&stats.TotalBooks).Error; err != nil {
		return nil, err
	}

	// 获取阅读中的书籍数
	if err := r.db.WithContext(ctx).Model(&models.Media{}).
		Where("user_id = ? AND type = ? AND status = ?", userID, models.MediaTypeBook, models.StatusInProgress).
		Count(&stats.ReadingBooks).Error; err != nil {
		return nil, err
	}

	// 获取电影总数
	if err := r.db.WithContext(ctx).Model(&models.Media{}).
		Where("user_id = ? AND type = ?", userID, models.MediaTypeMovie).
		Count(&stats.TotalMovies).Error; err != nil {
		return nil, err
	}

	// 获取观看中的电影数
	if err := r.db.WithContext(ctx).Model(&models.Media{}).
		Where("user_id = ? AND type = ? AND status = ?", userID, models.MediaTypeMovie, models.StatusInProgress).
		Count(&stats.WatchingMovies).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

// GetRecent 获取用户最近的媒体记录
func (r *MediaRepository) GetRecent(ctx context.Context, userID uint, limit int) ([]*models.Media, error) {
	var media []*models.Media
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("updated_at DESC").
		Limit(limit).
		Find(&media).Error
	return media, err
}

// GetHomeData 获取首页数据
func (r *MediaRepository) GetHomeData(ctx context.Context) (*models.HomeData, error) {
	var homeData models.HomeData

	// 获取最新的书籍
	if err := r.db.WithContext(ctx).
		Where("type = ?", models.MediaTypeBook).
		Order("created_at desc").
		Limit(5).
		Find(&homeData.LatestBooks).Error; err != nil {
		return nil, err
	}

	// 获取最新的电影
	if err := r.db.WithContext(ctx).
		Where("type = ?", models.MediaTypeMovie).
		Order("created_at desc").
		Limit(5).
		Find(&homeData.LatestMovies).Error; err != nil {
		return nil, err
	}

	// 获取评分最高的书籍
	if err := r.db.WithContext(ctx).
		Where("type = ?", models.MediaTypeBook).
		Order("rating desc").
		Limit(5).
		Find(&homeData.TopRatedBooks).Error; err != nil {
		return nil, err
	}

	// 获取评分最高的电影
	if err := r.db.WithContext(ctx).
		Where("type = ?", models.MediaTypeMovie).
		Order("rating desc").
		Limit(5).
		Find(&homeData.TopRatedMovies).Error; err != nil {
		return nil, err
	}

	return &homeData, nil
}

// 书籍详情操作
// =============

// CreateBookDetails 创建书籍详情
func (r *MediaRepository) CreateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

// GetBookDetails 获取书籍详情
func (r *MediaRepository) GetBookDetails(ctx context.Context, mediaID int) (*models.BookDetails, error) {
	var details models.BookDetails
	err := r.db.WithContext(ctx).
		Where("media_id = ?", mediaID).
		First(&details).Error
	if err != nil {
		return nil, err
	}
	return &details, nil
}

// UpdateBookDetails 更新书籍详情
func (r *MediaRepository) UpdateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

// 电影详情操作
// =============

// CreateMovieDetails 创建电影详情
func (r *MediaRepository) CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

// GetMovieDetails 获取电影详情
func (r *MediaRepository) GetMovieDetails(ctx context.Context, mediaID int) (*models.MovieDetails, error) {
	var details models.MovieDetails
	err := r.db.WithContext(ctx).
		Where("media_id = ?", mediaID).
		First(&details).Error
	if err != nil {
		return nil, err
	}
	return &details, nil
}

// UpdateMovieDetails 更新电影详情
func (r *MediaRepository) UpdateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *MediaRepository) ListByType(ctx context.Context, userID int, mediaType string) ([]models.Media, error) {
	var media []models.Media
	query := r.db.WithContext(ctx).Where("user_id = ?", userID)

	if mediaType != "" {
		query = query.Where("type = ?", mediaType)
	}

	err := query.Order("created_at desc").Find(&media).Error
	if err != nil {
		return nil, err
	}

	return media, nil
}

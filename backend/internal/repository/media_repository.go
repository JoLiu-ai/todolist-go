package repository

import (
	"context"

	"cute-todo/backend/internal/models"

	"gorm.io/gorm"
)

type GormMediaRepository struct {
	db *gorm.DB
}

func NewGormMediaRepository(db *gorm.DB) models.MediaRepository {
	return &GormMediaRepository{db: db}
}

func (r *GormMediaRepository) Create(ctx context.Context, media *models.Media) error {
	return r.db.WithContext(ctx).Create(media).Error
}

func (r *GormMediaRepository) GetByID(ctx context.Context, id uint) (*models.Media, error) {
	var media models.Media
	err := r.db.WithContext(ctx).First(&media, id).Error
	if err != nil {
		return nil, err
	}
	return &media, nil
}

func (r *GormMediaRepository) Update(ctx context.Context, media *models.Media) error {
	return r.db.WithContext(ctx).Save(media).Error
}

func (r *GormMediaRepository) Delete(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).Delete(&models.Media{}, id).Error
}

func (r *GormMediaRepository) List(ctx context.Context, filter models.MediaFilter) ([]*models.Media, error) {
	var medias []*models.Media
	query := r.db.WithContext(ctx)

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("display_name_primary LIKE ?", "%"+*filter.Title+"%")
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

	// 分页
	if filter.Page > 0 && filter.PageSize > 0 {
		offset := (filter.Page - 1) * filter.PageSize
		query = query.Offset(offset).Limit(filter.PageSize)
	}

	// 排序
	if filter.SortBy != "" {
		if filter.SortDesc {
			query = query.Order(filter.SortBy + " DESC")
		} else {
			query = query.Order(filter.SortBy)
		}
	} else {
		query = query.Order("created_at DESC")
	}

	err := query.Find(&medias).Error
	return medias, err
}

func (r *GormMediaRepository) Count(ctx context.Context, filter models.MediaFilter) (int64, error) {
	var count int64
	query := r.db.WithContext(ctx).Model(&models.Media{})

	if filter.Type != nil {
		query = query.Where("type = ?", *filter.Type)
	}
	if filter.Status != nil {
		query = query.Where("status = ?", *filter.Status)
	}
	if filter.Title != nil {
		query = query.Where("display_name_primary LIKE ?", "%"+*filter.Title+"%")
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

	err := query.Count(&count).Error
	return count, err
}

func (r *GormMediaRepository) GetNotes(ctx context.Context, mediaID uint, page, pageSize int) ([]*models.Note, error) {
	var notes []*models.Note
	query := r.db.WithContext(ctx).Where("media_id = ?", mediaID)

	if page > 0 && pageSize > 0 {
		offset := (page - 1) * pageSize
		query = query.Offset(offset).Limit(pageSize)
	}

	err := query.Order("created_at DESC").Find(&notes).Error
	return notes, err
}

func (r *GormMediaRepository) CountNotes(ctx context.Context, mediaID uint) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Note{}).Where("media_id = ?", mediaID).Count(&count).Error
	return count, err
}

func (r *GormMediaRepository) CreateNote(ctx context.Context, mediaID uint, note *models.Note) error {
	note.MediaID = int(mediaID)
	return r.db.WithContext(ctx).Create(note).Error
}

func (r *GormMediaRepository) UpdateNote(ctx context.Context, mediaID uint, note *models.Note) error {
	return r.db.WithContext(ctx).Where("media_id = ?", mediaID).Save(note).Error
}

func (r *GormMediaRepository) DeleteNote(ctx context.Context, mediaID, noteID uint) error {
	return r.db.WithContext(ctx).Where("media_id = ? AND id = ?", mediaID, noteID).Delete(&models.Note{}).Error
}

func (r *GormMediaRepository) CreateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *GormMediaRepository) GetBookDetails(ctx context.Context, mediaID uint) (*models.BookDetails, error) {
	var details models.BookDetails
	err := r.db.WithContext(ctx).Where("media_id = ?", mediaID).First(&details).Error
	if err != nil {
		return nil, err
	}
	return &details, nil
}

func (r *GormMediaRepository) UpdateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *GormMediaRepository) CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

func (r *GormMediaRepository) GetMovieDetails(ctx context.Context, mediaID uint) (*models.MovieDetails, error) {
	var details models.MovieDetails
	err := r.db.WithContext(ctx).Where("media_id = ?", mediaID).First(&details).Error
	if err != nil {
		return nil, err
	}
	return &details, nil
}

func (r *GormMediaRepository) UpdateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

// GetRecent 获取用户最近的媒体记录
func (r *GormMediaRepository) GetRecent(ctx context.Context, userID uint, limit int) ([]*models.Media, error) {
	var media []*models.Media
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("updated_at DESC").Limit(limit).Find(&media).Error
	return media, err
}

// GetStats 获取用户的媒体统计信息
func (r *GormMediaRepository) GetStats(ctx context.Context, userID uint) (*models.MediaStats, error) {
	var stats models.MediaStats

	// 获取书籍总数
	if err := r.db.Model(&models.Media{}).
		Where("user_id = ? AND type = ?", userID, "book").
		Count(&stats.TotalBooks).Error; err != nil {
		return nil, err
	}

	// 获取阅读中的书籍数
	if err := r.db.Model(&models.Media{}).
		Where("user_id = ? AND type = ? AND status = ?", userID, "book", "reading").
		Count(&stats.ReadingBooks).Error; err != nil {
		return nil, err
	}

	// 获取电影总数
	if err := r.db.Model(&models.Media{}).
		Where("user_id = ? AND type = ?", userID, "movie").
		Count(&stats.TotalMovies).Error; err != nil {
		return nil, err
	}

	// 获取观看中的电影数
	if err := r.db.Model(&models.Media{}).
		Where("user_id = ? AND type = ? AND status = ?", userID, "movie", "watching").
		Count(&stats.WatchingMovies).Error; err != nil {
		return nil, err
	}

	return &stats, nil
}

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

func (r *MediaRepository) Create(ctx context.Context, media *models.Media) error {
	return r.db.WithContext(ctx).Create(media).Error
}

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
		})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

func (r *MediaRepository) Delete(ctx context.Context, id, userID int) error {
	result := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&models.Media{})

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}

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

	err := query.Count(&count).Error
	return count, err
}

func (r *MediaRepository) GetNotes(ctx context.Context, mediaID int, page, pageSize int) ([]*models.Note, error) {
	var notes []*models.Note
	offset := (page - 1) * pageSize
	err := r.db.WithContext(ctx).
		Where("media_id = ?", mediaID).
		Order("created_at DESC").
		Offset(offset).
		Limit(pageSize).
		Find(&notes).Error
	return notes, err
}

func (r *MediaRepository) CountNotes(ctx context.Context, mediaID int) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&models.Note{}).
		Where("media_id = ?", mediaID).
		Count(&count).Error
	return count, err
}

func (r *MediaRepository) CreateNote(ctx context.Context, mediaID int, note *models.Note) error {
	note.MediaID = mediaID
	return r.db.WithContext(ctx).Create(note).Error
}

func (r *MediaRepository) CreateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

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

func (r *MediaRepository) UpdateBookDetails(ctx context.Context, details *models.BookDetails) error {
	return r.db.WithContext(ctx).Save(details).Error
}

func (r *MediaRepository) CreateMovieDetails(ctx context.Context, details *models.MovieDetails) error {
	return r.db.WithContext(ctx).Create(details).Error
}

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

func (r *MediaRepository) GetHomeData(ctx context.Context) (*models.HomeData, error) {
	var homeData models.HomeData

	// 获取最新的书籍
	err := r.db.WithContext(ctx).
		Where("type = ?", "book").
		Order("created_at desc").
		Limit(5).
		Find(&homeData.LatestBooks).Error
	if err != nil {
		return nil, err
	}

	// 获取最新的电影
	err = r.db.WithContext(ctx).
		Where("type = ?", "movie").
		Order("created_at desc").
		Limit(5).
		Find(&homeData.LatestMovies).Error
	if err != nil {
		return nil, err
	}

	// 获取评分最高的书籍
	err = r.db.WithContext(ctx).
		Where("type = ?", "book").
		Order("rating desc").
		Limit(5).
		Find(&homeData.TopRatedBooks).Error
	if err != nil {
		return nil, err
	}

	// 获取评分最高的电影
	err = r.db.WithContext(ctx).
		Where("type = ?", "movie").
		Order("rating desc").
		Limit(5).
		Find(&homeData.TopRatedMovies).Error
	if err != nil {
		return nil, err
	}

	return &homeData, nil
}

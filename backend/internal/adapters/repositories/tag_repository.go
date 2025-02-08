package repositories

import (
	"cute-todo/backend/internal/core/domain"
	"cute-todo/backend/internal/core/ports"

	"gorm.io/gorm"
)

type tagRepository struct {
	db *gorm.DB
}

func NewTagRepository(db *gorm.DB) ports.TagRepository {
	return &tagRepository{db: db}
}

func (r *tagRepository) Create(tag *domain.Tag) error {
	return r.db.Create(tag).Error
}

func (r *tagRepository) Update(tag *domain.Tag) error {
	return r.db.Save(tag).Error
}

func (r *tagRepository) Delete(id int) error {
	return r.db.Delete(&domain.Tag{}, id).Error
}

func (r *tagRepository) GetByID(id int) (*domain.Tag, error) {
	var tag domain.Tag
	err := r.db.First(&tag, id).Error
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

func (r *tagRepository) GetAll() ([]*domain.Tag, error) {
	var tags []*domain.Tag
	err := r.db.Find(&tags).Error
	if err != nil {
		return nil, err
	}
	return tags, nil
}

func (r *tagRepository) IncrementCount(id int) error {
	return r.db.Model(&domain.Tag{}).
		Where("id = ?", id).
		UpdateColumn("count", gorm.Expr("count + ?", 1)).
		Error
}

func (r *tagRepository) DecrementCount(id int) error {
	return r.db.Model(&domain.Tag{}).
		Where("id = ? AND count > 0", id).
		UpdateColumn("count", gorm.Expr("count - ?", 1)).
		Error
}

func (r *tagRepository) AddMediaTag(mediaID, tagID int) error {
	return r.db.Exec(`
		INSERT INTO media_tags (media_id, tag_id)
		VALUES (?, ?)
		ON CONFLICT (media_id, tag_id) DO NOTHING
	`, mediaID, tagID).Error
}

func (r *tagRepository) RemoveMediaTag(mediaID, tagID int) error {
	return r.db.Exec(`
		DELETE FROM media_tags
		WHERE media_id = ? AND tag_id = ?
	`, mediaID, tagID).Error
}

func (r *tagRepository) GetMediaTags(mediaID int) ([]*domain.Tag, error) {
	var tags []*domain.Tag
	err := r.db.Raw(`
		SELECT t.*
		FROM tags t
		JOIN media_tags mt ON mt.tag_id = t.id
		WHERE mt.media_id = ?
	`, mediaID).Scan(&tags).Error
	if err != nil {
		return nil, err
	}
	return tags, nil
}

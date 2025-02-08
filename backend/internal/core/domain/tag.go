package domain

import "time"

// Tag represents a tag that can be attached to media items
type Tag struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"uniqueIndex;not null"`
	Count     int       `json:"count" gorm:"default:0"`
	Media     []*Media  `json:"media,omitempty" gorm:"many2many:media_tags"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

func NewTag(name string) *Tag {
	now := time.Now()
	return &Tag{
		Name:      name,
		Count:     0,
		CreatedAt: now,
		UpdatedAt: now,
	}
}

func (t *Tag) Update(name string) {
	t.Name = name
	t.UpdatedAt = time.Now()
}

func (t *Tag) IncrementCount() {
	t.Count++
	t.UpdatedAt = time.Now()
}

func (t *Tag) DecrementCount() {
	if t.Count > 0 {
		t.Count--
		t.UpdatedAt = time.Now()
	}
}

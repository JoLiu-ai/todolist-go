package domain

import "time"

type Note struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	MediaID   uint      `json:"media_id" gorm:"not null"`
	Content   string    `json:"content" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
}

func NewNote(mediaID uint, content string) *Note {
	return &Note{
		MediaID: mediaID,
		Content: content,
	}
}

func (n *Note) Update(content string) {
	n.Content = content
}

// TableName specifies the table name for GORM
func (Note) TableName() string {
	return "media_notes"
}

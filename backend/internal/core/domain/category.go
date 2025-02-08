package domain

import "time"

type Category struct {
	ID        int       `json:"id" gorm:"column:id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"column:name"`
	Color     string    `json:"color" gorm:"column:color"`
	Icon      string    `json:"icon" gorm:"column:icon"`
	Type      string    `json:"type" gorm:"column:type"` // book or movie
	Count     int       `json:"count" gorm:"-"`
	CreatedAt time.Time `json:"createdAt" gorm:"column:created_at"`
	UpdatedAt time.Time `json:"updatedAt" gorm:"column:updated_at"`
	MediaType string    `json:"mediaType" gorm:"column:media_type"`
}

// TableName specifies the table name for GORM
func (Category) TableName() string {
	return "media_categories"
}

func NewCategory(name, mediaType string) *Category {
	now := time.Now()
	return &Category{
		Name:      name,
		Type:      mediaType,
		Color:     "#808080", // Default gray color
		Icon:      "📚",       // Default book icon
		Count:     0,
		CreatedAt: now,
		UpdatedAt: now,
		MediaType: mediaType,
	}
}

func (c *Category) Update(name string) {
	c.Name = name
	c.UpdatedAt = time.Now()
}

func (c *Category) IncrementCount() {
	c.Count++
	c.UpdatedAt = time.Now()
}

func (c *Category) DecrementCount() {
	if c.Count > 0 {
		c.Count--
		c.UpdatedAt = time.Now()
	}
}

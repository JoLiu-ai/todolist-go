-- 添加 type 列到 media 表
ALTER TABLE media
ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'book';

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_media_type ON media(type); 
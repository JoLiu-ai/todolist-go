-- 添加 user_id 列到 media 表
ALTER TABLE media
ADD COLUMN IF NOT EXISTS user_id INTEGER NOT NULL DEFAULT 1;

-- 添加外键约束
ALTER TABLE media
ADD CONSTRAINT fk_media_user
FOREIGN KEY (user_id) REFERENCES users(id);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_media_user_id ON media(user_id); 
-- 删除索引
DROP INDEX IF EXISTS idx_media_user_id;

-- 删除外键约束
ALTER TABLE media
DROP CONSTRAINT IF EXISTS fk_media_user;

-- 删除 user_id 列
ALTER TABLE media
DROP COLUMN IF EXISTS user_id; 
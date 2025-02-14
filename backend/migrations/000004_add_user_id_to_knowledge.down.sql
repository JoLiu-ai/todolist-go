-- 删除索引
DROP INDEX IF EXISTS idx_knowledge_user_id;

-- 删除 user_id 列
ALTER TABLE knowledge DROP COLUMN IF EXISTS user_id; 
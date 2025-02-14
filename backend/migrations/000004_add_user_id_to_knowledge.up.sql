-- 添加 user_id 列到知识表
ALTER TABLE knowledge
ADD COLUMN IF NOT EXISTS user_id INTEGER NOT NULL REFERENCES users(id);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_knowledge_user_id ON knowledge(user_id); 
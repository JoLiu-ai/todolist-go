-- 删除外键约束
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS fk_tasks_user;

-- 删除 user_id 列
ALTER TABLE tasks DROP COLUMN IF EXISTS user_id;

-- 恢复 category 列的默认值
ALTER TABLE tasks ALTER COLUMN category DROP DEFAULT; 
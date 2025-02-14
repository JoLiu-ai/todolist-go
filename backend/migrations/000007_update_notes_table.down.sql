-- 删除索引
DROP INDEX IF EXISTS idx_notes_user_id;
DROP INDEX IF EXISTS idx_notes_task_id;

-- 删除外键约束
ALTER TABLE notes
DROP CONSTRAINT IF EXISTS fk_notes_task,
DROP CONSTRAINT IF EXISTS fk_notes_user;

-- 删除列
ALTER TABLE notes
DROP COLUMN IF EXISTS title,
DROP COLUMN IF EXISTS user_id,
DROP COLUMN IF EXISTS task_id; 
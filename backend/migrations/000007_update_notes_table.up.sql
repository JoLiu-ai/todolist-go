-- 添加 title 字段
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT '';

-- 添加 user_id 字段
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS user_id INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT fk_notes_user FOREIGN KEY (user_id) REFERENCES users(id);

-- 添加 task_id 字段（可为空，因为不是所有便利签都需要关联任务）
ALTER TABLE notes
ADD COLUMN IF NOT EXISTS task_id INTEGER,
ADD CONSTRAINT fk_notes_task FOREIGN KEY (task_id) REFERENCES tasks(id);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_task_id ON notes(task_id); 
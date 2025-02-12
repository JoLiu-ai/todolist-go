-- 添加 user_id 列
ALTER TABLE tasks ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1;

-- 更新 category 列的默认值
ALTER TABLE tasks ALTER COLUMN category SET DEFAULT 'other';

-- 添加外键约束
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user FOREIGN KEY (user_id) REFERENCES users(id); 
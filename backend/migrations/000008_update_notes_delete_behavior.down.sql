-- 恢复外键约束的默认删除行为
ALTER TABLE notes
DROP CONSTRAINT IF EXISTS fk_notes_task,
ADD CONSTRAINT fk_notes_task
    FOREIGN KEY (task_id)
    REFERENCES tasks(id); 
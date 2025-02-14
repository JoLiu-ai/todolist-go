-- 修改外键约束的删除行为为 CASCADE
ALTER TABLE notes
DROP CONSTRAINT IF EXISTS fk_notes_task,
ADD CONSTRAINT fk_notes_task
    FOREIGN KEY (task_id)
    REFERENCES tasks(id)
    ON DELETE CASCADE; 
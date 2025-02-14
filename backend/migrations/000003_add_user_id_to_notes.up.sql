-- 添加user_id列到notes表
ALTER TABLE notes
ADD COLUMN user_id INTEGER;

-- 为现有笔记设置user_id（从关联的media表获取）
UPDATE notes
SET user_id = (
    SELECT user_id 
    FROM media 
    WHERE media.id = notes.media_id
);

-- 添加NOT NULL约束和外键约束
ALTER TABLE notes
ALTER COLUMN user_id SET NOT NULL,
ADD CONSTRAINT notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id); 
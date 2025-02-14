-- 移除user_id列和相关约束
ALTER TABLE notes
DROP CONSTRAINT IF EXISTS notes_user_id_fkey,
DROP COLUMN user_id; 
-- 删除索引
DROP INDEX IF EXISTS idx_media_type;
DROP INDEX IF EXISTS idx_media_status;
DROP INDEX IF EXISTS idx_media_title;
DROP INDEX IF EXISTS idx_media_category;
DROP INDEX IF EXISTS idx_book_details_isbn;
DROP INDEX IF EXISTS idx_movie_details_release_date;
DROP INDEX IF EXISTS idx_media_notes_media_id;

-- 删除表
DROP TABLE IF EXISTS media_notes;
DROP TABLE IF EXISTS movie_details;
DROP TABLE IF EXISTS book_details;
DROP TABLE IF EXISTS media;
DROP TABLE IF EXISTS media_categories;

-- 删除枚举类型
DROP TYPE IF EXISTS media_status;
DROP TYPE IF EXISTS media_type; 
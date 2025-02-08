-- 删除索引
DROP INDEX IF EXISTS idx_media_tags_media_id;
DROP INDEX IF EXISTS idx_media_tags_tag_id;
DROP INDEX IF EXISTS idx_tags_name;

-- 删除表
DROP TABLE IF EXISTS media_tags;
DROP TABLE IF EXISTS tags; 
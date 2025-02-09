-- 清理笔记数据
DELETE FROM media_notes WHERE id IN (1, 2, 3);

-- 清理电影详情
DELETE FROM movie_details WHERE id IN (3, 4);

-- 清理书籍详情
DELETE FROM book_details WHERE id IN (1, 2);

-- 清理媒体数据
DELETE FROM media WHERE id IN (1, 2, 3, 4);

-- 清理分类数据
DELETE FROM media_categories WHERE id IN (1, 2, 3, 4, 5, 6); 
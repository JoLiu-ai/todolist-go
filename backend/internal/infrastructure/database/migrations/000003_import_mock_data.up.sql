-- 导入分类数据
INSERT INTO media_categories (id, name, color, icon, type, created_at, updated_at) VALUES
(1, '小说', 'blue', '📚', 'book', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '哲学', 'purple', '🤔', 'book', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '科技', 'green', '💻', 'book', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '动作', 'red', '💥', 'movie', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '剧情', 'yellow', '🎭', 'movie', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, '科幻', 'indigo', '🚀', 'movie', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 导入媒体数据
INSERT INTO media (
    id, type, display_name_primary, original_name_primary,
    description_primary, creator, cover, status, rating,
    comment_primary, start_date, finish_date, tags,
    category_id, created_at, updated_at
) VALUES
-- 三体
(1, 'book', '三体', 'The Three-Body Problem',
'地球文明向宇宙发出广播，被三体文明接收到，于是三体文明决定入侵地球...', 
'刘慈欣', 'https://img2.doubanio.com/view/subject/l/public/s2768378.jpg',
'finished', 5, '震撼人心的科幻巨著',
'2024-01-01', '2024-01-15', 
ARRAY['科幻', '硬科幻', '中国科幻'],
3, '2024-01-01', '2024-01-15'),

-- 规训与惩罚
(2, 'book', '规训与惩罚', 'Discipline and Punish',
'现代监狱制度的起源...', '米歇尔·福柯', NULL,
'ongoing', 0, '深刻的历史分析',
'2024-01-20', NULL,
ARRAY['哲学', '社会学'],
2, '2024-01-20', '2024-01-22'),

-- 盗梦空间
(3, 'movie', '盗梦空间', 'Inception',
'在别人的梦境中植入想法...', '克里斯托弗·诺兰',
'https://img2.doubanio.com/view/photo/l/public/p513344864.jpg',
'finished', 5, '精彩的视觉盛宴',
'2024-01-05', '2024-01-05',
ARRAY['科幻', '动作', '悬疑'],
6, '2024-01-05', '2024-01-05'),

-- 怪奇物语
(4, 'movie', '怪奇物语', 'Stranger Things',
'小镇上发生神秘事件...', 'Duffer Brothers', NULL,
'wishlist', 0, NULL,
NULL, NULL,
ARRAY['科幻', '恐怖', '青春'],
6, '2024-01-23', '2024-01-23');

-- 导入书籍详情
INSERT INTO book_details (
    id, media_id, isbn, publisher, publish_date,
    pages, current_page, created_at, updated_at
) VALUES
(1, 1, '9787536692930', '重庆出版社', '2008-01-01',
302, 302, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, '9787108047038', '生活·读书·新知三联书店', '2012-01-01',
314, 156, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 导入电影详情
INSERT INTO movie_details (
    id, media_id, duration, release_date,
    country, language, created_at, updated_at
) VALUES
(3, 3, 148, '2010-07-16',
'美国', '英语', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, NULL, '2016-07-15',
'美国', '英语', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 导入笔记数据
INSERT INTO media_notes (
    id, media_id, content, created_at, updated_at
) VALUES
(1, 1, '水滴太酷了！', '2024-01-10 12:00:00', '2024-01-10 12:00:00'),
(2, 2, '全景敞视主义真是个有趣的概念', '2024-01-22 14:30:00', '2024-01-22 14:30:00'),
(3, 3, '陀螺还在转...', '2024-01-05 23:00:00', '2024-01-05 23:00:00'); 
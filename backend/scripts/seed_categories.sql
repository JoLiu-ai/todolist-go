-- 插入书籍分类数据
INSERT INTO media_categories (name, color, icon, type) VALUES
    ('心理学', '#FFB6C1', '🧠', 'book'),
    ('效率管理', '#87CEEB', '⚡', 'book'),
    ('认知科学', '#DDA0DD', '🔮', 'book'),
    ('神经科学', '#4B0082', '🧬', 'book'),
    ('行为经济学', '#90EE90', '📊', 'book'),
    ('习惯养成', '#FFD700', '🌱', 'book')
ON CONFLICT (name, type) DO NOTHING;

-- 插入电影分类数据
INSERT INTO media_categories (name, color, icon, type) VALUES
    ('科幻', '#00CED1', '🚀', 'movie'),
    ('动画', '#FFA500', '🎬', 'movie'),
    ('纪录片', '#20B2AA', '📹', 'movie'),
    ('剧情', '#BA55D3', '🎭', 'movie'),
    ('悬疑', '#4682B4', '🔍', 'movie'),
    ('喜剧', '#FFB6C1', '😄', 'movie')
ON CONFLICT (name, type) DO NOTHING; 
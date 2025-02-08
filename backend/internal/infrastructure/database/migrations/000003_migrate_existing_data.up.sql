-- 插入预定义的书籍分类
INSERT INTO media_categories (name, color, icon, type) VALUES
    ('心理学', 'pink', '🧠', 'book'),
    ('效率管理', 'blue', '⚡', 'book'),
    ('认知科学', 'purple', '🔮', 'book'),
    ('神经科学', 'indigo', '🧬', 'book'),
    ('行为经济学', 'green', '📊', 'book'),
    ('习惯养成', 'yellow', '🌱', 'book')
ON CONFLICT (name, type) DO NOTHING;

-- 插入预定义的电影分类
INSERT INTO media_categories (name, color, icon, type) VALUES
    ('动作', 'red', '💥', 'movie'),
    ('科幻', 'blue', '🚀', 'movie'),
    ('剧情', 'purple', '🎭', 'movie'),
    ('喜剧', 'yellow', '😄', 'movie'),
    ('纪录片', 'green', '🎥', 'movie'),
    ('动画', 'pink', '🌈', 'movie')
ON CONFLICT (name, type) DO NOTHING;

-- 创建状态映射函数
CREATE OR REPLACE FUNCTION map_old_status(old_status text, media_type text)
RETURNS media_status AS $$
BEGIN
    CASE 
        WHEN media_type = 'book' THEN
            RETURN CASE old_status
                WHEN 'reading' THEN 'ongoing'::media_status
                WHEN 'toread' THEN 'wishlist'::media_status
                WHEN 'completed' THEN 'finished'::media_status
                ELSE 'wishlist'::media_status
            END;
        WHEN media_type = 'movie' THEN
            RETURN CASE old_status
                WHEN 'watching' THEN 'ongoing'::media_status
                WHEN 'towatch' THEN 'wishlist'::media_status
                WHEN 'completed' THEN 'finished'::media_status
                ELSE 'wishlist'::media_status
            END;
    END CASE;
END;
$$ LANGUAGE plpgsql; 
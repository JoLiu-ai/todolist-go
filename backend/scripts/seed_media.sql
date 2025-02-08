-- 插入书籍数据
INSERT INTO media (
    type, 
    display_name_primary,
    original_name_primary,
    description_primary,
    creator,
    cover,
    status,
    rating,
    category_id
) VALUES
    (
        'book',
        '思考快与慢',
        'Thinking, Fast and Slow',
        '这本书综合了心理学与行为经济学的研究成果，深入浅出地解释了人类思维的双系统运作模式。',
        '丹尼尔·卡尼曼',
        'https://img1.doubanio.com/view/subject/l/public/s10345719.jpg',
        'finished',
        4.5,
        (SELECT id FROM media_categories WHERE name = '心理学' AND type = 'book')
    ),
    (
        'book',
        '原子习惯',
        'Atomic Habits',
        '一本关于如何养成好习惯、戒除坏习惯的实用指南。',
        '詹姆斯·克利尔',
        'https://img2.doubanio.com/view/subject/l/public/s33565235.jpg',
        'finished',
        4.8,
        (SELECT id FROM media_categories WHERE name = '习惯养成' AND type = 'book')
    ),
    (
        'book',
        '认知觉醒',
        'Mind Awakening',
        '通过认知科学的视角，探讨如何提升学习能力和工作效率。',
        '周岭',
        'https://img1.doubanio.com/view/subject/l/public/s33956867.jpg',
        'ongoing',
        4.2,
        (SELECT id FROM media_categories WHERE name = '认知科学' AND type = 'book')
    );

-- 插入电影数据
INSERT INTO media (
    type,
    display_name_primary,
    original_name_primary,
    description_primary,
    creator,
    cover,
    status,
    rating,
    category_id
) VALUES
    (
        'movie',
        '盗梦空间',
        'Inception',
        '一部关于梦境潜入的科幻动作电影，探讨了现实与梦境的界限。',
        '克里斯托弗·诺兰',
        'https://img2.doubanio.com/view/photo/l/public/s4357309.jpg',
        'finished',
        4.9,
        (SELECT id FROM media_categories WHERE name = '科幻' AND type = 'movie')
    ),
    (
        'movie',
        '千与千寻',
        '千と千尋の神隠し',
        '宫崎骏的动画杰作，讲述了小女孩千寻在神灵世界的冒险故事。',
        '宫崎骏',
        'https://img1.doubanio.com/view/photo/l/public/s1317937.jpg',
        'finished',
        4.9,
        (SELECT id FROM media_categories WHERE name = '动画' AND type = 'movie')
    ),
    (
        'movie',
        '利刃出鞘',
        'Knives Out',
        '一部现代版的侦探悬疑片，充满了出人意料的转折。',
        '莱恩·约翰逊',
        'https://img2.doubanio.com/view/photo/l/public/s33643831.jpg',
        'finished',
        4.5,
        (SELECT id FROM media_categories WHERE name = '悬疑' AND type = 'movie')
    );

-- 为书籍添加详细信息
INSERT INTO book_details (
    media_id,
    isbn,
    publisher,
    publish_date,
    pages,
    current_page
) VALUES
    (
        (SELECT id FROM media WHERE display_name_primary = '思考快与慢'),
        '9787208092990',
        '中信出版社',
        '2012-07-01',
        500,
        500
    ),
    (
        (SELECT id FROM media WHERE display_name_primary = '原子习惯'),
        '9787115549440',
        '人民邮电出版社',
        '2020-03-01',
        320,
        320
    ),
    (
        (SELECT id FROM media WHERE display_name_primary = '认知觉醒'),
        '9787115571731',
        '人民邮电出版社',
        '2021-01-01',
        260,
        180
    );

-- 为电影添加详细信息
INSERT INTO movie_details (
    media_id,
    duration,
    release_date,
    country,
    language
) VALUES
    (
        (SELECT id FROM media WHERE display_name_primary = '盗梦空间'),
        148,
        '2010-09-01',
        '美国',
        '英语'
    ),
    (
        (SELECT id FROM media WHERE display_name_primary = '千与千寻'),
        125,
        '2001-07-20',
        '日本',
        '日语'
    ),
    (
        (SELECT id FROM media WHERE display_name_primary = '利刃出鞘'),
        130,
        '2019-11-27',
        '美国',
        '英语'
    ); 
-- 创建媒体类型枚举
CREATE TYPE media_type AS ENUM ('book', 'movie');
CREATE TYPE media_status AS ENUM ('wishlist', 'ongoing', 'finished', 'dropped');

-- 创建媒体分类表
CREATE TABLE IF NOT EXISTS media_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    icon VARCHAR(10) NOT NULL,
    type media_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, type)
);

-- 创建媒体表
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    type media_type NOT NULL,
    display_name_primary VARCHAR(255) NOT NULL,
    display_name_secondary VARCHAR(255),
    original_name_primary VARCHAR(255),
    original_name_secondary VARCHAR(255),
    description_primary TEXT,
    description_secondary TEXT,
    creator VARCHAR(255),
    cover VARCHAR(1024),
    resource_link VARCHAR(1024),
    status media_status NOT NULL DEFAULT 'wishlist',
    rating DECIMAL(2,1) DEFAULT 0,
    comment_primary TEXT,
    comment_secondary TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    finish_date TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    category_id INTEGER REFERENCES media_categories(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建书籍详情表
CREATE TABLE IF NOT EXISTS book_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    isbn VARCHAR(20),
    publisher VARCHAR(255),
    publish_date DATE,
    pages INTEGER,
    current_page INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建电影详情表
CREATE TABLE IF NOT EXISTS movie_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    duration INTEGER,
    release_date DATE,
    country VARCHAR(100),
    language VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建笔记表
CREATE TABLE IF NOT EXISTS media_notes (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_status ON media(status);
CREATE INDEX idx_media_display_name_primary ON media(display_name_primary);
CREATE INDEX idx_media_display_name_secondary ON media(display_name_secondary);
CREATE INDEX idx_media_category ON media(category_id);
CREATE INDEX idx_book_details_isbn ON book_details(isbn);
CREATE INDEX idx_movie_details_release_date ON movie_details(release_date);
CREATE INDEX idx_media_notes_media_id ON media_notes(media_id); 
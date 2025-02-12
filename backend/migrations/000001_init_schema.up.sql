-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建任务表
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    priority INTEGER DEFAULT 1,
    category VARCHAR(50) DEFAULT 'other',
    due_date TIMESTAMP WITH TIME ZONE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建媒体表
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- book or movie
    title VARCHAR(255) NOT NULL,
    description TEXT,
    creator VARCHAR(255), -- author for books, director for movies
    cover_image TEXT,
    status VARCHAR(50) DEFAULT 'plan_to_read',
    rating FLOAT DEFAULT 0,
    tags TEXT[],
    progress INTEGER DEFAULT 0, -- pages read for books, minutes watched for movies
    user_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建书籍详情表
CREATE TABLE IF NOT EXISTS book_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id),
    isbn VARCHAR(50),
    author VARCHAR(255),
    publisher VARCHAR(255),
    publish_date TIMESTAMP WITH TIME ZONE,
    pages INTEGER,
    language VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建电影详情表
CREATE TABLE IF NOT EXISTS movie_details (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media(id),
    director VARCHAR(255),
    cast_members TEXT[], -- 演员列表
    release_date TIMESTAMP WITH TIME ZONE,
    duration INTEGER, -- in minutes
    language VARCHAR(50),
    country VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建笔记表
CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    page INTEGER,
    media_id INTEGER NOT NULL REFERENCES media(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 
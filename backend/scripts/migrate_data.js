const fs = require('fs');
const { Pool } = require('pg');
const path = require('path');

// 数据库配置
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todolist',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5433'),
});

// 读取导出的数据
function readExportedData() {
    const filePath = path.resolve(__dirname, '../../../app-1/data/cuteTodo_export.json');
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // 去重逻辑
    if (data.books) {
        const uniqueBooks = new Map();
        data.books.forEach(book => {
            const key = `${book.title}_${book.author}`;
            // 如果已存在相同的书，保留最新的一条（基于更新时间）
            if (!uniqueBooks.has(key) || 
                new Date(book.updatedAt) > new Date(uniqueBooks.get(key).updatedAt)) {
                uniqueBooks.set(key, book);
            }
        });
        data.books = Array.from(uniqueBooks.values());
        ;
    }

    if (data.movies) {
        const uniqueMovies = new Map();
        data.movies.forEach(movie => {
            const key = `${movie.title}_${movie.director || ''}`;
            // 如果已存在相同的电影，保留最新的一条
            if (!uniqueMovies.has(key) || 
                new Date(movie.updatedAt) > new Date(uniqueMovies.get(key).updatedAt)) {
                uniqueMovies.set(key, movie);
            }
        });
        data.movies = Array.from(uniqueMovies.values());
        ;
    }

    return data;
}

async function migrateBooks() {
    const data = readExportedData();
    const books = data.books || [];
    const categories = data.bookCategories || [];

    // 插入书籍分类
    for (const category of categories) {
        await pool.query(
            'INSERT INTO media_categories (name, color, icon, type) VALUES ($1, $2, $3, $4) ON CONFLICT (name, type) DO NOTHING',
            [category.name, category.color, category.icon, 'book']
        );
    }

    // 插入书籍
    for (const book of books) {
        // 获取分类ID
        const categoryResult = await pool.query(
            'SELECT id FROM media_categories WHERE name = $1 AND type = $2',
            [book.category, 'book']
        );
        const categoryId = categoryResult.rows[0]?.id;

        // 插入基本信息
        const mediaResult = await pool.query(
            `INSERT INTO media (
                type, title, description, creator, cover, status, rating,
                comment, start_date, finish_date, category_id, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
            [
                'book',
                book.title,
                book.description || '',
                book.author,
                book.cover || '',
                book.status === 'reading' ? 'ongoing' : book.status === 'toread' ? 'wishlist' : 'finished',
                book.rating || 0,
                book.comment || '',
                book.startDate ? new Date(book.startDate) : null,
                book.completedAt ? new Date(book.completedAt) : null,
                categoryId,
                new Date(book.createdAt || Date.now()),
                new Date(book.updatedAt || Date.now())
            ]
        );
        const mediaId = mediaResult.rows[0].id;

        // 插入书籍详情
        await pool.query(
            `INSERT INTO book_details (
                media_id, isbn, publisher, publish_date, pages, current_page
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                mediaId,
                book.isbn || '',
                book.publisher || '',
                book.publishDate ? new Date(book.publishDate) : null,
                book.pages || 0,
                book.currentPage || 0
            ]
        );

        // 插入笔记
        if (book.notes && book.notes.length > 0) {
            for (const note of book.notes) {
                await pool.query(
                    'INSERT INTO media_notes (media_id, content, created_at, updated_at) VALUES ($1, $2, $3, $4)',
                    [
                        mediaId,
                        note.content,
                        new Date(note.createdAt || Date.now()),
                        new Date(note.updatedAt || Date.now())
                    ]
                );
            }
        }
    }
}

async function migrateMovies() {
    const data = readExportedData();
    const movies = data.movies || [];
    const categories = data.movieCategories || [];

    // 插入电影分类
    for (const category of categories) {
        await pool.query(
            'INSERT INTO media_categories (name, color, icon, type) VALUES ($1, $2, $3, $4) ON CONFLICT (name, type) DO NOTHING',
            [category.name, category.color, category.icon, 'movie']
        );
    }

    // 插入电影
    for (const movie of movies) {
        // 获取分类ID
        const categoryResult = await pool.query(
            'SELECT id FROM media_categories WHERE name = $1 AND type = $2',
            [movie.category, 'movie']
        );
        const categoryId = categoryResult.rows[0]?.id;

        // 插入基本信息
        const mediaResult = await pool.query(
            `INSERT INTO media (
                type, title, description, creator, cover, status, rating,
                comment, start_date, finish_date, category_id, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
            [
                'movie',
                movie.title,
                movie.description || '',
                movie.director,
                movie.cover || '',
                movie.status === 'watching' ? 'ongoing' : movie.status === 'towatch' ? 'wishlist' : 'finished',
                movie.rating || 0,
                movie.comment || '',
                movie.startDate ? new Date(movie.startDate) : null,
                movie.completedAt ? new Date(movie.completedAt) : null,
                categoryId,
                new Date(movie.createdAt || Date.now()),
                new Date(movie.updatedAt || Date.now())
            ]
        );
        const mediaId = mediaResult.rows[0].id;

        // 插入电影详情
        await pool.query(
            `INSERT INTO movie_details (
                media_id, duration, release_date, country, language
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
                mediaId,
                movie.duration || 0,
                movie.releaseDate ? new Date(movie.releaseDate) : null,
                movie.country || '',
                movie.language || ''
            ]
        );

        // 插入笔记
        if (movie.notes && movie.notes.length > 0) {
            for (const note of movie.notes) {
                await pool.query(
                    'INSERT INTO media_notes (media_id, content, created_at, updated_at) VALUES ($1, $2, $3, $4)',
                    [
                        mediaId,
                        note.content,
                        new Date(note.createdAt || Date.now()),
                        new Date(note.updatedAt || Date.now())
                    ]
                );
            }
        }
    }
}

async function main() {
    try {
        ;
        await migrateBooks();
        await migrateMovies();
        ;
    } catch (error) {
        console.error('迁移失败:', error);
    } finally {
        await pool.end();
    }
}

main(); 
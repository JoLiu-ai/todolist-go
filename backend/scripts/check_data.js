const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todolist',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5433'),
});

async function checkData() {
    try {
        console.log('\n=== 检查媒体分类 ===');
        const categories = await pool.query(
            'SELECT type, COUNT(*) as count FROM media_categories GROUP BY type'
        );
        console.table(categories.rows);

        console.log('\n=== 检查媒体数量 ===');
        const media = await pool.query(
            'SELECT type, status, COUNT(*) as count FROM media GROUP BY type, status'
        );
        console.table(media.rows);

        console.log('\n=== 检查书籍详情（前5条） ===');
        const books = await pool.query(
            `SELECT m.title, m.status, m.rating, bd.isbn, bd.pages, bd.current_page 
             FROM media m 
             JOIN book_details bd ON m.id = bd.media_id 
             WHERE m.type = 'book' 
             LIMIT 5`
        );
        console.table(books.rows);

        console.log('\n=== 检查电影详情（前5条） ===');
        const movies = await pool.query(
            `SELECT m.title, m.status, m.rating, md.duration, md.country, md.language 
             FROM media m 
             JOIN movie_details md ON m.id = md.media_id 
             WHERE m.type = 'movie' 
             LIMIT 5`
        );
        console.table(movies.rows);

        console.log('\n=== 检查笔记数量 ===');
        const notes = await pool.query(
            `SELECT m.type, COUNT(mn.id) as notes_count 
             FROM media m 
             LEFT JOIN media_notes mn ON m.id = mn.media_id 
             GROUP BY m.type`
        );
        console.table(notes.rows);

    } catch (error) {
        console.error('查询失败:', error);
    } finally {
        await pool.end();
    }
}

checkData(); 
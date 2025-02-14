const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 数据库配置
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cute_todo',
  password: 'postgres',
  port: 5432,
});

// 读取导出的数据
async function readExportedData() {
  const filePath = path.join(__dirname, '../../../app/data/cuteTodo_export.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return data;
}

// 迁移分类
async function migrateCategories(data) {
  ('开始迁移分类...');

  // 收集所有分类
  const bookCategories = new Map();
  const movieCategories = new Map();

  // 处理书籍分类
  data.books?.forEach(book => {
    if (book.category) {
      if (!bookCategories.has(book.category)) {
        bookCategories.set(book.category, 1);
      } else {
        bookCategories.set(book.category, bookCategories.get(book.category) + 1);
      }
    }
  });

  // 处理影视分类
  data.movies?.forEach(movie => {
    if (movie.category) {
      if (!movieCategories.has(movie.category)) {
        movieCategories.set(movie.category, 1);
      } else {
        movieCategories.set(movie.category, movieCategories.get(movie.category) + 1);
      }
    }
  });

  // 插入书籍分类
  for (const [name, count] of bookCategories) {
    await pool.query(
      'INSERT INTO categories (name, type, count) VALUES ($1, $2, $3)',
      [name, 'book', count]
    );
  }

  // 插入影视分类
  for (const [name, count] of movieCategories) {
    await pool.query(
      'INSERT INTO categories (name, type, count) VALUES ($1, $2, $3)',
      [name, 'movie', count]
    );
  }

  ('分类迁移完成！');
}

// 迁移标签
async function migrateTags(data) {
  ('开始迁移标签...');

  // 收集所有标签
  const tags = new Map();
  const mediaTagRelations = [];

  // 处理书籍标签
  data.books?.forEach(book => {
    if (book.tags && Array.isArray(book.tags)) {
      book.tags.forEach(tag => {
        if (!tags.has(tag)) {
          tags.set(tag, 1);
        } else {
          tags.set(tag, tags.get(tag) + 1);
        }
        mediaTagRelations.push({
          mediaId: book.id,
          tagName: tag
        });
      });
    }
  });

  // 处理影视标签
  data.movies?.forEach(movie => {
    if (movie.tags && Array.isArray(movie.tags)) {
      movie.tags.forEach(tag => {
        if (!tags.has(tag)) {
          tags.set(tag, 1);
        } else {
          tags.set(tag, tags.get(tag) + 1);
        }
        mediaTagRelations.push({
          mediaId: movie.id,
          tagName: tag
        });
      });
    }
  });

  // 插入标签
  const tagIdMap = new Map();
  for (const [name, count] of tags) {
    const result = await pool.query(
      'INSERT INTO tags (name, count) VALUES ($1, $2) RETURNING id',
      [name, count]
    );
    tagIdMap.set(name, result.rows[0].id);
  }

  // 插入媒体-标签关联
  for (const relation of mediaTagRelations) {
    const tagId = tagIdMap.get(relation.tagName);
    if (tagId) {
      await pool.query(
        'INSERT INTO media_tags (media_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [relation.mediaId, tagId]
      );
    }
  }

  ('标签迁移完成！');
}

// 主函数
async function main() {
  try {
    ('开始数据迁移...');
    const data = await readExportedData();
    await migrateCategories(data);
    await migrateTags(data);
    ('数据迁移完成！');
  } catch (error) {
    console.error('迁移失败:', error);
  } finally {
    await pool.end();
  }
}

main(); 
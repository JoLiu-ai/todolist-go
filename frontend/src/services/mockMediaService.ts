import { Book, Movie, Category, Media } from '../types/media';
import { books, movies, categories } from '../mock/data';

export const mockMediaService = {
  // 获取所有分类
  getCategories: async (): Promise<Category[]> => {
    return Promise.resolve(categories);
  },

  // 获取所有媒体项目
  getMediaItems: async (type: 'book' | 'movie'): Promise<Media[]> => {
    return Promise.resolve(type === 'book' ? books : movies);
  },

  // 获取单个媒体项目
  getMediaItem: async (id: number): Promise<Media | null> => {
    const allMedia = [...books, ...movies];
    const item = allMedia.find(item => item.id === id);
    return Promise.resolve(item || null);
  },

  // 获取媒体项目的笔记
  getNotes: async (mediaId: number): Promise<{ id: number; content: string; createdAt: string; updatedAt: string; }[]> => {
    const item = [...books, ...movies].find(item => item.id === mediaId);
    return Promise.resolve(item?.notes || []);
  },

  // 获取统计信息
  getStats: async (type: 'book' | 'movie'): Promise<{
    total: number;
    finished: number;
    ongoing: number;
    wishlist: number;
    dropped: number;
  }> => {
    const items = type === 'book' ? books : movies;
    return Promise.resolve({
      total: items.length,
      finished: items.filter(item => item.status === 'finished').length,
      ongoing: items.filter(item => item.status === 'ongoing').length,
      wishlist: items.filter(item => item.status === 'wishlist').length,
      dropped: items.filter(item => item.status === 'dropped').length,
    });
  }
}; 
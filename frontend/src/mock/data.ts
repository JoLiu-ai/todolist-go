import { Book, Movie, Category } from '../types/media';

export const categories: Category[] = [
  { id: 1, name: '小说', color: 'blue', icon: '📚', type: 'book' },
  { id: 2, name: '哲学', color: 'purple', icon: '🤔', type: 'book' },
  { id: 3, name: '科技', color: 'green', icon: '💻', type: 'book' },
  { id: 4, name: '动作', color: 'red', icon: '💥', type: 'movie' },
  { id: 5, name: '剧情', color: 'yellow', icon: '🎭', type: 'movie' },
  { id: 6, name: '科幻', color: 'indigo', icon: '🚀', type: 'movie' },
];

export const books: Book[] = [
  {
    id: 1,
    type: 'book',
    displayName: {
      primary: '三体'
    },
    originalName: {
      primary: 'The Three-Body Problem'
    },
    description: {
      primary: '地球文明向宇宙发出广播，被三体文明接收到，于是三体文明决定入侵地球...'
    },
    creator: '刘慈欣',
    cover: 'https://img2.doubanio.com/view/subject/l/public/s2768378.jpg',
    status: 'finished',
    rating: 5,
    comment: {
      primary: '震撼人心的科幻巨著'
    },
    startDate: '2024-01-01',
    finishDate: '2024-01-15',
    tags: ['科幻', '硬科幻', '中国科幻'],
    categoryId: 3,
    category: categories[2],
    notes: [
      {
        id: 1,
        content: '水滴太酷了！',
        createdAt: '2024-01-10T12:00:00Z',
        updatedAt: '2024-01-10T12:00:00Z'
      }
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    details: {
      id: 1,
      mediaId: 1,
      isbn: '9787536692930',
      publisher: '重庆出版社',
      publishDate: '2008-01-01',
      pages: 302,
      currentPage: 302
    }
  },
  {
    id: 2,
    type: 'book',
    displayName: {
      primary: '规训与惩罚'
    },
    originalName: {
      primary: 'Discipline and Punish'
    },
    description: {
      primary: '现代监狱制度的起源...'
    },
    creator: '米歇尔·福柯',
    status: 'ongoing',
    rating: 0,
    comment: {
      primary: '深刻的历史分析'
    },
    startDate: '2024-01-20',
    tags: ['哲学', '社会学'],
    categoryId: 2,
    category: categories[1],
    notes: [
      {
        id: 2,
        content: '全景敞视主义真是个有趣的概念',
        createdAt: '2024-01-22T14:30:00Z',
        updatedAt: '2024-01-22T14:30:00Z'
      }
    ],
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-22T14:30:00Z',
    details: {
      id: 2,
      mediaId: 2,
      isbn: '9787108047038',
      publisher: '生活·读书·新知三联书店',
      publishDate: '2012-01-01',
      pages: 314,
      currentPage: 156
    }
  }
];

export const movies: Movie[] = [
  {
    id: 3,
    type: 'movie',
    displayName: {
      primary: '盗梦空间'
    },
    originalName: {
      primary: 'Inception'
    },
    description: {
      primary: '在别人的梦境中植入想法...'
    },
    creator: '克里斯托弗·诺兰',
    cover: 'https://img2.doubanio.com/view/photo/l/public/p513344864.jpg',
    status: 'finished',
    rating: 5,
    comment: {
      primary: '精彩的视觉盛宴'
    },
    startDate: '2024-01-05',
    finishDate: '2024-01-05',
    tags: ['科幻', '动作', '悬疑'],
    categoryId: 6,
    category: categories[5],
    notes: [
      {
        id: 3,
        content: '陀螺还在转...',
        createdAt: '2024-01-05T23:00:00Z',
        updatedAt: '2024-01-05T23:00:00Z'
      }
    ],
    createdAt: '2024-01-05T20:00:00Z',
    updatedAt: '2024-01-05T23:00:00Z',
    details: {
      id: 3,
      mediaId: 3,
      duration: 148,
      releaseDate: '2010-07-16',
      country: '美国',
      language: '英语'
    }
  },
  {
    id: 4,
    type: 'movie',
    displayName: {
      primary: '怪奇物语'
    },
    originalName: {
      primary: 'Stranger Things'
    },
    description: {
      primary: '小镇上发生神秘事件...'
    },
    creator: 'Duffer Brothers',
    status: 'wishlist',
    rating: 0,
    tags: ['科幻', '恐怖', '青春'],
    categoryId: 6,
    category: categories[5],
    createdAt: '2024-01-23T00:00:00Z',
    updatedAt: '2024-01-23T00:00:00Z',
    details: {
      id: 4,
      mediaId: 4,
      releaseDate: '2016-07-15',
      country: '美国',
      language: '英语'
    }
  }
]; 
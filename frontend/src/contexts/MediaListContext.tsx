import { createContext, useContext, useState, useEffect } from 'react';
import type { Media } from '../types/media';
import { mediaApi } from '../api/client';

interface MediaListContextType {
  mediaList: Media[];
  loading: boolean;
  error: string | null;
  fetchMediaList: () => Promise<void>;
  addMedia: (media: Media) => Promise<void>;
  updateMedia: (id: number, media: Media) => Promise<void>;
  deleteMedia: (id: number) => Promise<void>;
}

const MediaListContext = createContext<MediaListContextType>({
  mediaList: [],
  loading: false,
  error: null,
  fetchMediaList: async () => {},
  addMedia: async () => {},
  updateMedia: async () => {},
  deleteMedia: async () => {},
});

export const useMediaList = () => {
  const context = useContext(MediaListContext);
  if (!context) {
    throw new Error('useMediaList must be used within a MediaListProvider');
  }
  return context;
};

interface MediaListProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const MediaListProvider = ({ children }: MediaListProviderProps) => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMediaList = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await mediaApi.getAll({});
      setMediaList(response.data);
    } catch (err: any) {
      console.error('Failed to fetch media list:', err);
      if (err.response?.status === 401) {
        setError('请先登录后查看');
      } else {
        setError(err.response?.data?.message || '获取列表失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const addMedia = async (media: Media) => {
    try {
      await mediaApi.create(media);
      await fetchMediaList();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '添加失败';
      setError(errorMsg);
      throw err;
    }
  };

  const updateMedia = async (id: number, media: Media) => {
    try {
      await mediaApi.update(id, media);
      await fetchMediaList();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '更新失败';
      setError(errorMsg);
      throw err;
    }
  };

  const deleteMedia = async (id: number) => {
    try {
      await mediaApi.delete(id);
      await fetchMediaList();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '删除失败';
      setError(errorMsg);
      throw err;
    }
  };

  useEffect(() => {
    fetchMediaList();
  }, []);

  return (
    <MediaListContext.Provider
      value={{
        mediaList,
        loading,
        error,
        fetchMediaList,
        addMedia,
        updateMedia,
        deleteMedia,
      }}
    >
      {children}
    </MediaListContext.Provider>
  );
};

export default MediaListContext; 
import { useState, useEffect } from 'react';
import { Media } from '../types/media';
import { mediaApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

export default function useMediaList() {
  const [mediaList, setMediaList] = useState([] as Media[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMedia = async () => {
      if (!user) {
        setLoading(false);
        setError('请先登录');
        return;
      }

      try {
        setError(null);
        ;
        const response = await mediaApi.getAll({});
        ;
        if (!response?.data) {
          throw new Error('Invalid response format');
        }
        setMediaList(response.data);
      } catch (err: any) {
        console.error('Failed to fetch media list. Details:', {
          error: err,
          response: err.response,
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
        if (err.response?.status === 401) {
          setError('请先登录后查看');
        } else {
          const errorMsg = err.response?.data?.message || err.message || '获取列表失败';
          setError(`获取列表失败: ${errorMsg}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [user]);

  return { mediaList, loading, error };
} 
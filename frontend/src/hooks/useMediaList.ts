import { useState, useEffect } from 'react';
import { Media } from '../types/media';
import { mediaApi } from '../api/client';

export default function useMediaList() {
  const [mediaList, setMediaList] = useState([] as Media[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as string | null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setError(null);
        console.log('Fetching media list...');
        const response = await mediaApi.getAll({});
        console.log('Response:', response);
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
  }, []);

  return { mediaList, loading, error };
} 
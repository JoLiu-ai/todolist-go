import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMediaList, deleteMedia } from '@/api/media';
import Layout from '@/components/Layout';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function MediaBatchDeletePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: mediaList, isLoading } = useQuery({
    queryKey: ['media', 'movie'],
    queryFn: () => fetchMediaList({ type: 'movie' }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
    },
  });

  const handleDeleteAll = async () => {
    if (!mediaList?.items?.length || !window.confirm('确定要删除所有影视记录吗？此操作不可恢复。')) {
      return;
    }

    setIsDeleting(true);
    try {
      for (const media of mediaList.items) {
        await deleteMutation.mutateAsync(media.id);
      }
      alert('所有影视记录已删除');
      navigate('/movies');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto text-center py-12">
          <TrashIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            删除所有影视记录
          </h1>
          <p className="text-gray-500 mb-8">
            {isLoading
              ? '正在加载影视记录...'
              : `共有 ${mediaList?.items?.length || 0} 条影视记录`}
          </p>
          <button
            onClick={handleDeleteAll}
            disabled={isLoading || isDeleting || !mediaList?.items?.length}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            {isDeleting ? '正在删除...' : '删除所有影视记录'}
          </button>
        </div>
      </div>
    </Layout>
  );
} 
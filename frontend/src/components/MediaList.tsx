import React, { useEffect, useState } from 'react';
import { useMediaList } from '../hooks/useMediaList';
import { MediaCard } from './MediaCard';
import { Skeleton } from './Skeleton';

interface Props {
  type: 'book' | 'movie';
  limit?: number;
}

export default function MediaList({ type, limit }: Props) {
  const { mediaList, loading } = useMediaList(type);

  if (loading) return <Skeleton count={limit || 5} />;

  return (
    <div className="space-y-4">
      {(limit ? mediaList.slice(0, limit) : mediaList).map(item => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
} 
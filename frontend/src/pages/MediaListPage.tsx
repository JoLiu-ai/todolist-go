import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useMediaList } from '../hooks/useMediaList';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MediaListItem from '../components/MediaListItem';

interface Props {
  mediaType: 'book' | 'movie';
  title: string;
  apiPath: string;
}

export default function MediaListPage({ mediaType, title, apiPath }: Props) {
  const { mediaList, loading } = useMediaList(apiPath);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-serif mb-6">{title}</h1>
      <div className="grid gap-4">
        {mediaList.map(item => (
          <MediaListItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
} 
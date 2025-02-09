import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { useMediaList } from '../contexts/MediaListContext';
import MediaListItem from '../components/MediaListItem';
import type { Media } from '../types/media';

export default function HomePage() {
  const { user } = useAuth();
  const { mediaList, loading, error } = useMediaList();

  console.log('HomePage render:', { user, mediaList, loading, error });
  
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (loading) {
    console.log('Loading media list...');
    return <div className="container mx-auto p-4">加载中...</div>;
  }

  if (error) {
    console.log('Error loading media list:', error);
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  const latestBooks = mediaList
    .filter((item: Media) => item.type === 'book')
    .slice(0, 5);

  const latestMovies = mediaList
    .filter((item: Media) => item.type === 'movie')
    .slice(0, 5);

  console.log('Filtered media:', { latestBooks, latestMovies });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <MediaSection 
        title="最新书籍" 
        items={latestBooks}
        linkTo="/books"
      />
      <MediaSection
        title="最新电影"
        items={latestMovies}
        linkTo="/movies"
      />
    </div>
  );
}

// 更新 MediaSection 组件
const MediaSection = ({ title, items, linkTo }: { 
  title: string;
  items: Media[];
  linkTo: string;
}) => (
  <section>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-serif">{title}</h2>
      <Link 
        to={linkTo}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        查看全部 →
      </Link>
    </div>
    <div className="grid gap-3">
      {items.map(item => (
        <MediaListItem 
          key={item.id} 
          item={item}
          onViewDetail={() => {}}
          onEdit={() => {}}
        />
      ))}
    </div>
  </section>
); 
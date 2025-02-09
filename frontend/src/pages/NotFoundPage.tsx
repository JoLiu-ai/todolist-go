import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#fcf9f3] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-serif text-[#2c2c2c] text-4xl mb-4">404</h1>
        <p className="font-serif text-[#4a4a4a] mb-8">页面不存在</p>
        <Link 
          to="/"
          className="inline-flex items-center h-9 px-4 text-sm font-serif text-[#946b45] hover:text-[#7c593a] bg-[#f7f3eb] hover:bg-[#ebe5d9] transition-all"
        >
          <span className="mr-1.5">←</span>
          返回首页
        </Link>
      </div>
    </div>
  );
}

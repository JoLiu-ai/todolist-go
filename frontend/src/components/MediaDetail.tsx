import React, { useState, useEffect } from 'react';
import type { Media, Note } from '../types/media';
import Modal from './Modal';
import { useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface MediaDetailProps {
  item: Media;
  onClose: () => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onAddNote: (content: string) => Promise<void>;
  onEditNote: (noteId: number, content: string) => Promise<void>;
  onDeleteNote: (noteId: number) => Promise<void>;
}

interface NotesResponse {
  notes: Note[];
  total: number;
  page: number;
  pageSize: number;
}

const MediaDetail: React.FC<MediaDetailProps> = ({
  item,
  onClose,
  onEdit,
  onDelete,
  onAddNote,
  onEditNote,
  onDeleteNote,
}) => {
  const { id } = useParams();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // 获取笔记数据
  const fetchNotes = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/media/${item.id}/notes?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notes');
      }
      const data: NotesResponse = await response.json();
      setNotes(data.notes);
      setTotalNotes(data.total);
      setPageSize(data.pageSize);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 当页码改变时获取新数据
  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage, item.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'wishlist':
        return 'bg-yellow-100 text-yellow-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '无效日期';
    }
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAddNoteClick = () => {
    setIsAddingNote(true);
    setNoteContent('');
    setEditingNoteId(null);
  };

  const handleEditNoteClick = (note: Note) => {
    setIsAddingNote(true);
    setNoteContent(note.content);
    setEditingNoteId(note.id);
  };

  const handleNoteSubmit = async () => {
    if (!noteContent.trim()) return;

    try {
      if (editingNoteId !== null) {
        await onEditNote(editingNoteId, noteContent);
      } else {
        await onAddNote(noteContent);
      }
      // 重新获取当前页的笔记
      await fetchNotes(currentPage);
    } catch (error) {
      console.error('Error submitting note:', error);
    }

    setNoteContent('');
    setIsAddingNote(false);
    setEditingNoteId(null);
  };

  const handleDeleteNoteClick = async (noteId: number) => {
    if (confirm('确定要删除这条笔记吗？')) {
      try {
        await onDeleteNote(noteId);
        // 重新获取当前页的笔记
        await fetchNotes(currentPage);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  // 分页控制
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalNotes / pageSize);

  return (
    <div className="fixed inset-0 bg-[#fcf9f3] z-50 overflow-hidden">
      <div className="h-full flex max-w-6xl mx-auto">
        {/* Left Panel - Media Info */}
        <div className="w-80 bg-white/80 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-y-auto border-r border-[#ebe5d9]">
          <div className="sticky top-0">
            {/* Cover Image */}
            <div className="relative aspect-[2/3] bg-gradient-to-b from-[#f7f3eb] to-[#ebe5d9] group">
              {item.cover && !imageError ? (
                <img
                  src={item.cover}
                  alt={item.display_name?.primary || '封面'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-4xl opacity-60 transition-transform duration-300 group-hover:scale-110">
                    {item.type === 'book' ? '📚' : '🎬'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Media Info */}
            <div className="px-6 py-6 space-y-6">
              {/* Title Section */}
              <div>
                <h2 className="font-serif text-[#2c2c2c] text-lg font-medium leading-snug">
                  {item.display_name?.primary || '无题'}
                </h2>
                {item.display_name?.secondary && (
                  <p className="mt-1.5 font-serif text-sm text-[#666666] italic">
                    {item.display_name.secondary}
                  </p>
                )}
                {item.original_name?.primary && (
                  <p className="mt-2 font-serif text-sm text-[#666666] italic">
                    {item.original_name.primary}
                    {item.original_name.secondary && (
                      <span className="block opacity-75">{item.original_name.secondary}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Status and Rating */}
              <div className="flex items-center justify-between pt-4 border-t border-[#ebe5d9]">
                <div>
                  <p className="text-[11px] text-[#8c8c8c] tracking-wide uppercase mb-1.5 font-serif">状态</p>
                  <span className="inline-block px-2.5 py-1 text-xs font-serif text-[#4a4a4a] bg-[#f7f3eb] rounded-sm transition-colors duration-300 hover:bg-[#ebe5d9]">
                    {item.status === 'ongoing' ? (item.type === 'book' ? '阅读中' : '观看中') :
                     item.status === 'finished' ? (item.type === 'book' ? '已读完' : '已看完') :
                     item.status === 'wishlist' ? (item.type === 'book' ? '想读' : '想看') :
                     item.status === 'dropped' ? (item.type === 'book' ? '已弃读' : '已弃看') :
                     item.status}
                  </span>
                </div>
                {item.rating > 0 && (
                  <div className="text-right">
                    <p className="text-[11px] text-[#8c8c8c] tracking-wide uppercase mb-1.5 font-serif">评分</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[#d4b483]">✦</span>
                      <span className="text-sm font-serif text-[#4a4a4a]">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Creator */}
              {typeof item.creator === 'string' && item.creator.length > 0 && (
                <div className="pt-4 border-t border-[#ebe5d9]">
                  <p className="text-[11px] text-[#8c8c8c] tracking-wide uppercase mb-1.5 font-serif">
                    {item.type === 'book' ? '文字' : '影像'}
                  </p>
                  <p className="text-sm font-serif text-[#4a4a4a]">{item.creator}</p>
                </div>
              )}

              {/* Description */}
              {item.description?.primary && (
                <div className="pt-4 border-t border-[#ebe5d9]">
                  <p className="text-[11px] text-[#8c8c8c] tracking-wide uppercase mb-1.5 font-serif">简记</p>
                  <div className="prose prose-sm max-w-none">
                    <p className="font-serif text-[#4a4a4a] leading-relaxed">{item.description.primary}</p>
                    {item.description.secondary && (
                      <p className="mt-2 font-serif text-[#666666] italic leading-relaxed">
                        {item.description.secondary}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Dates */}
              {(item.start_date || item.finish_date) && (
                <div className="pt-4 border-t border-[#ebe5d9]">
                  <p className="text-[11px] text-[#8c8c8c] tracking-wide uppercase mb-1.5 font-serif">时间</p>
                  <div className="space-y-1">
                    {item.start_date && (
                      <p className="text-sm font-serif text-[#4a4a4a]">
                        始于 <span className="text-[#2c2c2c]">{formatDate(item.start_date)}</span>
                      </p>
                    )}
                    {item.finish_date && (
                      <p className="text-sm font-serif text-[#4a4a4a]">
                        终于 <span className="text-[#2c2c2c]">{formatDate(item.finish_date)}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="pt-4 border-t border-[#ebe5d9]">
                  <p className="text-[11px] text-[#8c8c8c] tracking-wide uppercase mb-1.5 font-serif">标签</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-2.5 py-1 bg-[#f7f3eb] text-[#4a4a4a] text-xs font-serif"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resource Link */}
              {item.resource_link && (
                <div className="pt-4 border-t border-[#ebe5d9]">
                  <a
                    href={item.resource_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#8c8c8c] hover:text-[#d4b483] transition-colors duration-300"
                  >
                    <span>资源链接</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-[#ebe5d9]">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onEdit(item.id)}
                    className="flex items-center justify-center w-full h-9 text-sm font-serif text-[#946b45] hover:text-[#7c593a] bg-[#f7f3eb] hover:bg-[#ebe5d9] transition-all"
                  >
                    <span className="mr-1.5">✦</span>
                    编辑
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="flex items-center justify-center w-full h-9 text-sm font-serif text-[#c25450] hover:text-[#a3433f] bg-[#f9e9e8] hover:bg-[#f5dbd9] transition-all"
                  >
                    <span className="mr-1.5">✕</span>
                    删除
                  </button>
                  <button
                    onClick={handleAddNoteClick}
                    className="flex items-center justify-center w-full h-9 text-sm font-serif text-[#3c6665] hover:text-[#2d4d4c] bg-[#eaf1f1] hover:bg-[#dce7e7] transition-all"
                  >
                    <span className="mr-1.5">✎</span>
                    写随笔
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Notes */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-[#ebe5d9] flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#2c2c2c]">笔记</h3>
            <button
              onClick={handleAddNoteClick}
              className="px-4 py-2 text-sm font-serif text-[#4a4a4a] bg-[#f7f3eb] hover:bg-[#ebe5d9] transition-colors duration-300 rounded-sm"
            >
              添加笔记
            </button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {isLoading ? (
              <LoadingSpinner />
            ) : notes.length > 0 ? (
              <div className="space-y-6">
                {notes.map((note: Note) => (
                  <div
                    key={note.id}
                    className="bg-white/80 backdrop-blur-sm rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-[#4a4a4a] whitespace-pre-wrap">
                          {note.content}
                        </p>
                        <p className="mt-2 text-xs text-[#8c8c8c]">
                          {formatDate(note.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditNoteClick(note)}
                          className="text-sm text-[#8c8c8c] hover:text-[#d4b483] transition-colors duration-300"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteNoteClick(note.id)}
                          className="text-sm text-[#8c8c8c] hover:text-[#d4b483] transition-colors duration-300"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-[#8c8c8c]">暂无笔记</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sticky bottom-0 z-10 px-8 py-4 bg-white/80 backdrop-blur-sm border-t border-[#ebe5d9] flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 text-sm font-serif rounded-sm transition-colors duration-300 ${
                    currentPage === page
                      ? 'bg-[#d4b483] text-white'
                      : 'text-[#4a4a4a] hover:bg-[#f7f3eb]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Note Modal */}
      {isAddingNote && (
        <Modal onClose={() => setIsAddingNote(false)}>
          <div className="w-full max-w-lg">
            <h3 className="text-lg font-serif text-[#2c2c2c] mb-4">
              {editingNoteId ? '编辑笔记' : '添加笔记'}
            </h3>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full h-32 p-3 text-sm text-[#4a4a4a] bg-[#f7f3eb] border border-[#ebe5d9] rounded-sm resize-none focus:outline-none focus:border-[#d4b483] transition-colors duration-300"
              placeholder="写下你的想法..."
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsAddingNote(false)}
                className="px-4 py-2 text-sm text-[#8c8c8c] hover:text-[#4a4a4a] transition-colors duration-300"
              >
                取消
              </button>
              <button
                onClick={handleNoteSubmit}
                className="px-4 py-2 text-sm text-white bg-[#d4b483] hover:bg-[#c9a978] transition-colors duration-300 rounded-sm"
              >
                保存
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MediaDetail; 
import React, { useState, useEffect } from 'react';
import { Media, Note } from '../types/media';
import Modal from './Modal';

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
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [expandedNoteId, setExpandedNoteId] = useState<number | null>(null);
  const [imageError, setImageError] = React.useState(false);
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
    <div className="fixed inset-0 bg-[#fafafa] z-50 overflow-hidden">
      <div className="h-full flex max-w-5xl mx-auto">
        {/* Left Panel - Media Info */}
        <div className="w-72 bg-white shadow-sm overflow-y-auto">
          <div className="sticky top-0">
            {/* Cover Image */}
            <div className="relative aspect-[2/3] bg-[#f5f5f5] group">
              {item.cover && !imageError ? (
                <img
                  src={item.cover}
                  alt={item.display_name?.primary || 'Media cover'}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <span className="text-2xl opacity-40">
                    {item.type === 'book' ? '📚' : '🎬'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Media Info */}
            <div className="px-4 py-5 space-y-5">
              <div>
                <h2 className="text-base font-medium text-neutral-800">
                  {item.display_name?.primary || 'Untitled'}
                </h2>
                {item.display_name?.secondary && (
                  <p className="mt-1 text-sm text-neutral-500 font-normal">
                    {item.display_name.secondary}
                  </p>
                )}
                {item.original_name?.primary && (
                  <p className="mt-1 text-sm text-neutral-400">
                    {item.original_name.primary}
                    {item.original_name.secondary && (
                      <span className="block opacity-75">{item.original_name.secondary}</span>
                    )}
                  </p>
                )}
              </div>

              {typeof item.creator === 'string' && item.creator.length > 0 && (
                <div className="pt-4 border-t border-neutral-100">
                  <p className="text-[11px] text-neutral-400 tracking-wide uppercase">
                    {item.type === 'book' ? 'Author' : 'Director'}
                  </p>
                  <p className="mt-1.5 text-sm text-neutral-600">{item.creator}</p>
                </div>
              )}

              {item.description?.primary && (
                <div className="pt-4 border-t border-neutral-100">
                  <p className="text-[11px] text-neutral-400 tracking-wide uppercase">Description</p>
                  <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">{item.description.primary}</p>
                  {item.description.secondary && (
                    <p className="mt-2 text-sm text-neutral-500 italic leading-relaxed">
                      {item.description.secondary}
                    </p>
                  )}
                </div>
              )}

              {item.resource_link && (
                <div className="pt-4 border-t border-neutral-100">
                  <p className="text-[11px] text-neutral-400 tracking-wide uppercase">Resource</p>
                  <a
                    href={item.resource_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-sm text-blue-500 hover:text-blue-600"
                  >
                    {item.resource_link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Notes */}
        <div className="flex-1 flex flex-col min-w-0 bg-white border-l border-neutral-100">
          {/* Header with all actions */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-100">
            <div className="flex items-baseline">
              <h3 className="text-base font-medium text-neutral-800">笔记</h3>
              <span className="ml-2 text-sm text-neutral-400">
                {totalNotes} 条
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddNoteClick}
                className="inline-flex items-center h-9 px-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all hover:shadow-sm"
              >
                <span className="mr-1.5">✏️</span>
                写笔记
              </button>
              <button
                onClick={() => onEdit(item.id)}
                className="inline-flex items-center h-9 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-all hover:shadow-sm"
              >
                <span className="mr-1.5">✨</span>
                编辑
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="inline-flex items-center h-9 px-4 text-sm font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-all hover:shadow-sm"
              >
                <span className="mr-1.5">🗑️</span>
                删除
              </button>
            </div>
          </div>

          {/* Notes Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <span className="text-sm text-neutral-500">加载中...</span>
              </div>
            ) : totalNotes > 0 ? (
              <div className="space-y-3">
                {notes.map(note => (
                  <div
                    key={note.id}
                    className="group relative bg-neutral-50 hover:bg-white rounded-lg p-4 transition-all hover:shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                  >
                    <p className="text-sm text-neutral-700 whitespace-pre-wrap break-words leading-relaxed">
                      {note.content}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200/70">
                      <time className="text-xs text-neutral-400">
                        {formatDate(note.createdAt)}
                      </time>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditNoteClick(note)}
                          className="text-xs font-medium text-blue-500 hover:text-blue-600 mr-3"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteNoteClick(note.id)}
                          className="text-xs font-medium text-rose-500 hover:text-rose-600"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm text-neutral-600 bg-neutral-100 rounded-md disabled:opacity-50"
                    >
                      上一页
                    </button>
                    <span className="text-sm text-neutral-600">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm text-neutral-600 bg-neutral-100 rounded-md disabled:opacity-50"
                    >
                      下一页
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="mt-4 text-sm text-neutral-600 font-medium">开始写下你的第一条笔记吧</p>
                <div>
                  <button
                    onClick={handleAddNoteClick}
                    className="mt-4 inline-flex items-center h-9 px-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all hover:shadow-sm"
                  >
                    <span className="mr-1.5">✏️</span>
                    写笔记
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Editor Modal */}
      <Modal isOpen={isAddingNote} onClose={() => setIsAddingNote(false)}>
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-neutral-800">
              {editingNoteId ? '编辑笔记' : '写笔记'}
            </h4>
          </div>
          <div className="relative">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="写下你的想法..."
              rows={10}
              className="w-full text-sm text-neutral-700 bg-neutral-50 border-0 rounded-lg focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed placeholder:text-neutral-400 p-4"
              autoFocus
            />
            <div className="absolute bottom-3 right-3 text-xs text-neutral-400">
              {noteContent.length} 字
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setIsAddingNote(false)}
              className="h-9 px-5 text-sm font-medium text-neutral-600 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-all hover:shadow-sm"
            >
              取消
            </button>
            <button
              onClick={handleNoteSubmit}
              disabled={!noteContent.trim()}
              className="h-9 px-5 text-sm font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-all hover:shadow-sm disabled:opacity-50"
            >
              {editingNoteId ? '保存' : '添加'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MediaDetail; 
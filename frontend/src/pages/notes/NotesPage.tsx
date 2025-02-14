import React, { useEffect, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { PersonalNote, personalNotesApi } from '@/api/notes';
import { Task, taskApi } from '@/api/tasks';
import { TrashIcon, PencilIcon, HomeIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';

export default function NotesPage() {
  const [notes, setNotes] = useState([] as PersonalNote[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<PersonalNote | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    category: '',
    taskId: undefined as number | undefined,
  });

  // 加载便利签数据
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await personalNotesApi.getAll();
        setNotes(data.notes);
      } catch (err) {
        setError('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // 加载任务数据
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await taskApi.getAll();
        setTasks(response.tasks);
      } catch (err) {
        console.error('Failed to load tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  // 删除便利签
  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个便利签吗？')) {
      return;
    }

    try {
      await personalNotesApi.delete(id);
      setNotes(notes.filter((note: PersonalNote) => note.id !== id));
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  // 打开编辑模态框
  const handleEdit = (note: PersonalNote) => {
    setSelectedNote(note);
    setEditForm({
      title: note.title,
      content: note.content,
      category: note.category,
      taskId: note.taskId,
    });
    setIsEditModalOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!selectedNote) return;

    try {
      await personalNotesApi.update(selectedNote.id, editForm);
      setNotes(notes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, ...editForm }
          : note
      ));
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  // 关联任务
  const handleLinkTask = (note: PersonalNote) => {
    setSelectedNote(note);
    setIsTaskModalOpen(true);
  };

  // 保存任务关联
  const handleSaveTaskLink = async (taskId: number) => {
    if (!selectedNote) return;

    try {
      await personalNotesApi.update(selectedNote.id, { taskId });
      setNotes(notes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, taskId }
          : note
      ));
      setIsTaskModalOpen(false);
    } catch (err) {
      setError('Failed to link task');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4b483]"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* 面包屑导航 */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="flex items-center group">
                  <HomeIcon className="w-4 h-4 text-[#d4b483]" />
                  <span className="ml-2 text-sm font-medium text-gray-500 group-hover:text-[#d4b483] transition-colors">首页</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-[#d4b483]">/</span>
                  <div className="flex items-center">
                    <DocumentTextIcon className="w-4 h-4 text-[#d4b483]" />
                    <span className="ml-2 text-sm font-medium text-[#d4b483]">便利签</span>
                  </div>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* 便利签列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note: PersonalNote) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 relative group"
            >
              <Link to={`/notes/${note.id}`} className="block">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                  {note.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {new Intl.DateTimeFormat('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }).format(new Date(note.createdAt))}
                  </span>
                  <div className="flex items-center space-x-2">
                    {note.taskId && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        已关联任务
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </span>
                  </div>
                </div>
              </Link>

              {/* 操作按钮 */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleLinkTask(note)}
                  className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                  title="关联任务"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEdit(note)}
                  className="p-1 text-gray-400 hover:text-[#d4b483] transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={(e: MouseEvent) => {
                    e.preventDefault();
                    handleDelete(note.id);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">还没有便利签，快来创建一个吧！</p>
            <Link
              to="/notes/create"
              className="inline-block mt-4 px-4 py-2 bg-[#d4b483] text-white rounded-lg hover:bg-[#c9a978] transition-colors"
            >
              创建便利签
            </Link>
          </div>
        )}

        {/* 编辑模态框 */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="编辑便利签"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">标题</label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">内容</label>
              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">分类</label>
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483]"
              >
                <option value="brain">脑科学</option>
                <option value="psychology">心理学</option>
                <option value="cognitive">认知科学</option>
                <option value="productivity">效率管理</option>
                <option value="habits">习惯养成</option>
                <option value="emotion">情绪管理</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#d4b483] text-white rounded-md text-sm font-medium hover:bg-[#c9a978]"
              >
                保存
              </button>
            </div>
          </div>
        </Modal>

        {/* 关联任务模态框 */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title="关联任务"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">选择任务</label>
              <select
                value={editForm.taskId}
                onChange={(e) => setEditForm({ ...editForm, taskId: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#d4b483] focus:ring-[#d4b483]"
              >
                <option value="">不关联任务</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => handleSaveTaskLink(editForm.taskId!)}
                className="px-4 py-2 bg-[#d4b483] text-white rounded-md text-sm font-medium hover:bg-[#c9a978]"
              >
                保存
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
}

// 获取分类对应的颜色
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'brain': 'bg-purple-100 text-purple-500',
    'psychology': 'bg-pink-100 text-pink-500',
    'cognitive': 'bg-indigo-100 text-indigo-500',
    'productivity': 'bg-yellow-100 text-yellow-500',
    'habits': 'bg-green-100 text-green-500',
    'emotion': 'bg-orange-100 text-orange-500',
  };

  return colors[category] || 'bg-gray-100 text-gray-500';
} 
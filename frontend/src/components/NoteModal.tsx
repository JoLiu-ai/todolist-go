import React, { useState } from 'react';
import Modal from './Modal';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
}

const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (content.trim()) {
      await onSubmit(content);
      setContent('');
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Add Note</h3>
        <textarea
          className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {content.length} characters
          </span>
          <div className="space-x-2">
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NoteModal; 
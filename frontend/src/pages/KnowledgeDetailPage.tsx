import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Divider, message, Popconfirm } from 'antd';
import { useAuth } from '../hooks/useAuth';

interface Knowledge {
  id: number;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

function KnowledgeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [knowledge, setKnowledge] = React.useState<Knowledge | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchKnowledge = async () => {
      if (!id) return;
      
      try {
        const response = await fetch(`/api/knowledge/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch knowledge');
        }
        const data = await response.json();
        setKnowledge(data);
      } catch (error) {
        message.error('Failed to fetch knowledge');
        navigate('/knowledge');
      } finally {
        setLoading(false);
      }
    };

    fetchKnowledge();
  }, [id, token, navigate]);

  const handleEdit = () => {
    if (!id) return;
    navigate(`/knowledge/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete knowledge');
      }

      message.success('Knowledge deleted successfully');
      navigate('/knowledge');
    } catch (error) {
      message.error('Failed to delete knowledge');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!knowledge) {
    return <div>Knowledge not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title={knowledge.title}
        extra={
          <div className="flex gap-4">
            <Button onClick={handleEdit}>Edit</Button>
            <Popconfirm
              title="Delete this knowledge?"
              description="Are you sure you want to delete this knowledge? This action cannot be undone."
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </div>
        }
      >
        {knowledge.category && (
          <div className="mb-4">
            <strong>Category:</strong> {knowledge.category}
          </div>
        )}

        {knowledge.tags && knowledge.tags.length > 0 && (
          <div className="mb-4">
            <strong>Tags:</strong>{' '}
            {knowledge.tags.map((tag: string) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        <Divider />

        <div className="whitespace-pre-wrap">{knowledge.content}</div>

        <Divider />

        <div className="text-sm text-gray-500">
          <div>Created: {new Date(knowledge.created_at).toLocaleString()}</div>
          <div>Last updated: {new Date(knowledge.updated_at).toLocaleString()}</div>
        </div>
      </Card>
    </div>
  );
}

export default KnowledgeDetailPage; 
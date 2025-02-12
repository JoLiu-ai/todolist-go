import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../hooks/useAuth';

interface KnowledgeData {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

const EditKnowledgePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form] = Form.useForm<KnowledgeData>();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchKnowledge = async () => {
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
        form.setFieldsValue(data);
      } catch (error) {
        message.error('Failed to fetch knowledge');
        navigate('/knowledge');
      }
    };

    if (id) {
      fetchKnowledge();
    }
  }, [id, token, form, navigate]);

  const onFinish = async (values: KnowledgeData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update knowledge');
      }

      message.success('Knowledge updated successfully');
      navigate('/knowledge');
    } catch (error) {
      message.error('Failed to update knowledge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Knowledge</h1>
      <Form<KnowledgeData>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="max-w-2xl"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Please input the content!' }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          help="Separate tags with commas"
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
            <Button onClick={() => navigate('/knowledge')}>
              Cancel
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditKnowledgePage; 
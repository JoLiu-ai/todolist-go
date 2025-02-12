import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useAuth } from '../hooks/useAuth';

interface KnowledgeData {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
}

const CreateKnowledgePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [form] = Form.useForm<KnowledgeData>();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: KnowledgeData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create knowledge');
      }

      message.success('Knowledge created successfully');
      navigate('/knowledge');
    } catch (error) {
      message.error('Failed to create knowledge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create Knowledge</h1>
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
              Create
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

export default CreateKnowledgePage; 
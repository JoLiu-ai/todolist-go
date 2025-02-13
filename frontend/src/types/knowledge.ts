export interface Knowledge {
  id: number;
  title: string;
  content: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateKnowledgeData {
  title: string;
  content: string;
  category?: string;
}

export interface KnowledgeListResponse {
  items: Knowledge[];
  total: number;
  page: number;
  size: number;
} 

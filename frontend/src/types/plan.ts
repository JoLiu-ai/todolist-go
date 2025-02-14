export type PlanType = 'monthly' | 'weekly' | 'daily';

export type PlanStatus = 'not_started' | 'in_progress' | 'completed' | 'overdue';

export type PlanPriority = 'low' | 'medium' | 'high';

export interface Plan {
  id: number;
  title: string;
  description?: string;
  type: PlanType;
  status: PlanStatus;
  priority: PlanPriority;
  progress: number;
  start_time: string;
  end_time: string;
  related_task_ids?: number[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  user_id: number;
}

export interface CreatePlanData {
  title: string;
  description?: string;
  type: PlanType;
  priority: PlanPriority;
  start_time: string;
  end_time: string;
  related_task_ids?: number[];
  tags?: string[];
}

export interface UpdatePlanData extends Partial<CreatePlanData> {
  status?: PlanStatus;
  progress?: number;
}

export interface PlanFilter {
  type?: PlanType;
  status?: PlanStatus;
  priority?: PlanPriority;
  start_time?: string;
  end_time?: string;
  search?: string;
}

export interface PlanListResponse {
  items: Plan[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PlanDetailResponse {
  plan: Plan;
  related_tasks: Array<{
    id: number;
    title: string;
    status: string;
  }>;
} 
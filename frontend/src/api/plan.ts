import { dynamicClient } from './client';
import type {
  Plan,
  CreatePlanData,
  UpdatePlanData,
  PlanFilter,
  PlanListResponse,
  PlanDetailResponse,
} from '../types/plan';

const endpoints = {
  base: '/plans',
  detail: (id: number) => `/plans/${id}`,
  progress: (id: number) => `/plans/${id}/progress`,
  status: (id: number) => `/plans/${id}/status`,
  tasks: (planId: number, taskId: number) => `/plans/${planId}/tasks/${taskId}`,
  monthly: '/plans/monthly',
  weekly: '/plans/weekly',
  daily: '/plans/daily',
};

export async function createPlan(data: CreatePlanData): Promise<Plan> {
  const response = await dynamicClient.post<Plan>(endpoints.base, data);
  return response;
}

export async function updatePlan(id: number, data: UpdatePlanData): Promise<Plan> {
  const response = await dynamicClient.put<Plan>(endpoints.detail(id), data);
  return response;
}

export async function deletePlan(id: number): Promise<void> {
  await dynamicClient.delete(endpoints.detail(id));
}

export async function getPlanById(id: number): Promise<PlanDetailResponse> {
  const response = await dynamicClient.get<PlanDetailResponse>(endpoints.detail(id));
  return response;
}

export async function getPlans(filter: PlanFilter = {}): Promise<PlanListResponse> {
  const response = await dynamicClient.get<PlanListResponse>(endpoints.base, { params: filter });
  return response;
}

export async function getMonthlyPlans(year: number, month: number): Promise<Plan[]> {
  const response = await dynamicClient.get<Plan[]>(endpoints.monthly, {
    params: { year, month }
  });
  return response;
}

export async function getWeeklyPlans(year: number, week: number): Promise<Plan[]> {
  const response = await dynamicClient.get<Plan[]>(endpoints.weekly, {
    params: { year, week }
  });
  return response;
}

export async function getDailyPlans(date: string): Promise<Plan[]> {
  const response = await dynamicClient.get<Plan[]>(endpoints.daily, {
    params: { date }
  });
  return response;
}

export async function updatePlanProgress(id: number, progress: number): Promise<Plan> {
  const response = await dynamicClient.put<Plan>(endpoints.progress(id), { progress });
  return response;
}

export async function updatePlanStatus(id: number, status: string): Promise<Plan> {
  const response = await dynamicClient.put<Plan>(endpoints.status(id), { status });
  return response;
}

export async function addTaskToPlan(planId: number, taskId: number): Promise<void> {
  await dynamicClient.post(endpoints.tasks(planId, taskId), {});
}

export async function removeTaskFromPlan(planId: number, taskId: number): Promise<void> {
  await dynamicClient.delete(endpoints.tasks(planId, taskId));
} 

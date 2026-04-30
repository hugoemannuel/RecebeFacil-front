import { api } from './api';

export interface MessageTemplate {
  id: string;
  name: string;
  body: string;
  trigger: 'MANUAL' | 'BEFORE_DUE' | 'ON_DUE' | 'OVERDUE';
  is_default: boolean;
  is_system?: boolean;
}

export async function getTemplates(): Promise<MessageTemplate[]> {
  const { data } = await api.get('/profiles/me/templates');
  return data;
}

export async function createTemplate(template: Omit<MessageTemplate, 'id'>): Promise<MessageTemplate> {
  const { data } = await api.post('/profiles/me/templates', template);
  return data;
}

export async function updateTemplate(id: string, template: Partial<MessageTemplate>): Promise<MessageTemplate> {
  const { data } = await api.patch(`/profiles/me/templates/${id}`, template);
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  await api.delete(`/profiles/me/templates/${id}`);
}

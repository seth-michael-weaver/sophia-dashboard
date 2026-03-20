import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, type PaginatedResponse } from '@/services/api';

interface MessageAPI {
  id: number;
  sender: number;
  sender_name: string;
  sender_username: string;
  subject: string;
  body: string;
  parent: number | null;
  recipients: Array<{
    recipient: number;
    recipient_name: string;
    recipient_username: string;
    is_read: boolean;
    read_at: string | null;
  }>;
  is_read: boolean | null;
  created_at: string;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
}

export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  time: string;
  read: boolean;
}

function transformMessage(m: MessageAPI): InboxMessage {
  return {
    id: String(m.id),
    from: m.sender_name || m.sender_username,
    subject: m.subject || '(no subject)',
    body: m.body,
    time: formatTimeAgo(m.created_at),
    read: m.is_read ?? true,
  };
}

export function useInbox() {
  return useQuery({
    queryKey: ['messages', 'inbox'],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<MessageAPI>>('/messaging/');
      return data.results.map(transformMessage);
    },
  });
}

export function useSentMessages() {
  return useQuery({
    queryKey: ['messages', 'sent'],
    queryFn: async () => {
      const data = await apiFetch<PaginatedResponse<MessageAPI>>('/messaging/sent/');
      return data.results.map(transformMessage);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { subject?: string; body: string; recipient_ids: number[] }) =>
      apiFetch('/messaging/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (messageId: string) =>
      apiFetch(`/messaging/${messageId}/mark-read/`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] });
    },
  });
}

export function useReplyMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ messageId, body }: { messageId: string; body: string }) =>
      apiFetch(`/messaging/${messageId}/reply/`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

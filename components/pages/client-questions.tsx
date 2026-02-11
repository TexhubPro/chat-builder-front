import React from 'react';
import { Head, usePage } from '@inertiajs/react';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import ClientKanbanBoard, { type KanbanColumn, type KanbanItem } from '../components/kanban/ClientKanbanBoard';

const columns: KanbanColumn[] = [
    { key: 'open', title: 'Открытые' },
    { key: 'processing', title: 'В работе' },
    { key: 'resolved', title: 'Решенные' },
];

export default function ClientQuestionsPage() {
    const { props } = usePage<{ questions?: KanbanItem[]; csrf_token?: string }>();
    const csrfToken = props.csrf_token ?? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    const updateItem = async (id: KanbanItem['id'], payload: Record<string, unknown>) => {
        const response = await fetch(`/client-questions/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) return null;
        const data = await response.json();
        return (data.item ?? null) as KanbanItem | null;
    };

    const deleteItem = async (id: KanbanItem['id']) => {
        const response = await fetch(`/client-questions/${id}`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': csrfToken,
            },
        });

        if (!response.ok) return false;
        const data = await response.json();
        return Boolean(data.deleted);
    };

    return (
        <>
            <Head title="Вопросы клиентов" />
            <DashboardLayout title="Вопросы клиентов" defaultSelectedKey="client-questions">
                <ClientKanbanBoard
                    title="Вопросы клиентов"
                    description="Канбан-доска вопросов. Изменения сохраняются в базе автоматически."
                    columns={columns}
                    items={props.questions ?? []}
                    showQuestionField
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                />
            </DashboardLayout>
        </>
    );
}

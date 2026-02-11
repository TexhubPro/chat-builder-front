import React from 'react';
import { Head, usePage } from '@inertiajs/react';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import ClientKanbanBoard, { type KanbanColumn, type KanbanItem } from '../components/kanban/ClientKanbanBoard';

const columns: KanbanColumn[] = [
    { key: 'new', title: 'Новые' },
    { key: 'processing', title: 'В обработке' },
    { key: 'done', title: 'Завершены' },
];

export default function ClientRequestsPage() {
    const { props } = usePage<{ requests?: KanbanItem[]; csrf_token?: string }>();
    const csrfToken = props.csrf_token ?? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    const updateItem = async (id: KanbanItem['id'], payload: Record<string, unknown>) => {
        const response = await fetch(`/client-requests/${id}`, {
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
        const response = await fetch(`/client-requests/${id}`, {
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
            <Head title="Заявки клиентов" />
            <DashboardLayout title="Заявки клиентов" defaultSelectedKey="client-requests">
                <ClientKanbanBoard
                    title="Заявки клиентов"
                    description="Канбан-доска заявок. Изменения сохраняются в базе автоматически."
                    columns={columns}
                    items={props.requests ?? []}
                    onUpdateItem={updateItem}
                    onDeleteItem={deleteItem}
                />
            </DashboardLayout>
        </>
    );
}

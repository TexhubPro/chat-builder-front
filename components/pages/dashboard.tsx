import React from 'react';
import { Head } from '@inertiajs/react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function Dashboard() {
    return (
        <>
            <Head title="Панель управления" />
            <DashboardLayout title="Панель управления" defaultSelectedKey="dashboard">
                <div className="flex min-h-[420px] w-full flex-col gap-4 rounded-medium border-small border-divider bg-slate-50/80 p-6 dark:bg-[#1f1f24]/80">
                    <div className="text-sm text-slate-500">Главная панель пока пустая.</div>
                </div>
            </DashboardLayout>
        </>
    );
}

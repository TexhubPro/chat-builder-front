import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import React from 'react';
import ThemeToggle from '../../components/ThemeToggle';

export default function Pending() {
    const { props } = usePage();
    const csrfToken =
        (props as { csrf_token?: string }).csrf_token ??
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
        '';

    return (
        <>
            <Head title="Заявка принята" />
            <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 dark:from-[#17171b] dark:to-[#17171b]">
                <div className="absolute right-6 top-6">
                    <ThemeToggle />
                </div>
                <div className="rounded-large flex w-full max-w-md flex-col gap-4 border border-slate-200/80 bg-white px-8 pb-8 pt-6 text-slate-900 shadow-xl shadow-slate-200/60 dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90 dark:text-slate-100 dark:shadow-none">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                            <Icon icon="solar:check-circle-bold" className="text-2xl" />
                        </span>
                        <div>
                            <p className="text-2xl font-semibold">Ваша заявка получена</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Ожидает подтверждения модератора</p>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <p>Мы уже рассматриваем вашу регистрацию как компании.</p>
                        <p>После подтверждения мы сообщим вам на электронную почту.</p>
                    </div>
                    <Button
                        color="primary"
                        onPress={() => router.reload({ preserveScroll: true, preserveState: true })}
                    >
                        Обновить статус
                    </Button>
                    <Button
                        color="danger"
                        onPress={() => router.post('/logout', { _token: csrfToken })}
                    >
                        Выйти
                    </Button>
                </div>
            </div>
        </>
    );
}

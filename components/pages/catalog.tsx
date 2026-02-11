import React from 'react';
import { Head } from '@inertiajs/react';
import { Button, Card, CardBody, Chip, Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import DashboardLayout from '../components/dashboard/DashboardLayout';

type CatalogItem = {
    id: string;
    name: string;
    type: 'service' | 'product';
    price: string;
    status: 'active' | 'draft';
    description: string;
    tags: string[];
};

const SAMPLE_ITEMS: CatalogItem[] = [
    {
        id: 'cat-1',
        name: 'Консультация специалиста',
        type: 'service',
        price: 'от 1 200 ₽',
        status: 'active',
        description: 'Персональная консультация с разбором задач клиента и рекомендациями.',
        tags: ['онлайн', '60 минут'],
    },
    {
        id: 'cat-2',
        name: 'Настройка интеграции',
        type: 'service',
        price: '5 900 ₽',
        status: 'draft',
        description: 'Быстрая настройка Instagram/Telegram-каналов и автоматизаций.',
        tags: ['интеграции', 'под ключ'],
    },
    {
        id: 'cat-3',
        name: 'Пакет “Старт”',
        type: 'product',
        price: '9 900 ₽',
        status: 'active',
        description: 'Готовый пакет услуг и материалов для запуска клиентского сервиса.',
        tags: ['шаблоны', 'документы'],
    },
    {
        id: 'cat-4',
        name: 'Абонентское сопровождение',
        type: 'service',
        price: '15 000 ₽/мес',
        status: 'active',
        description: 'Ежемесячное сопровождение и улучшение процессов поддержки клиентов.',
        tags: ['поддержка', 'ежемесячно'],
    },
];

const CATEGORY_FILTERS = ['Все', 'Услуги', 'Товары', 'Активные', 'Черновики'];

export default function CatalogPage() {
    return (
        <>
            <Head title="Каталог и услуги" />
            <DashboardLayout title="Каталог и услуги" defaultSelectedKey="catalog">
                <div className="flex flex-col gap-6">
                    <div className="rounded-large border border-slate-200/80 bg-white p-6 shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Ваш каталог</h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Добавляйте товары и услуги, чтобы ассистент использовал их при ответах клиентам.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="bordered" startContent={<Icon icon="solar:upload-linear" className="text-lg" />}>
                                    Импорт
                                </Button>
                                <Button color="primary" startContent={<Icon icon="solar:add-circle-linear" className="text-lg" />}>
                                    Добавить позицию
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_1fr]">
                            <Input
                                placeholder="Поиск по каталогу"
                                startContent={<Icon icon="solar:magnifer-linear" className="text-lg text-slate-400" />}
                                variant="bordered"
                            />
                            <div className="flex flex-wrap gap-2">
                                {CATEGORY_FILTERS.map((filter) => (
                                    <Button key={filter} size="sm" variant={filter === 'Все' ? 'solid' : 'bordered'}>
                                        {filter}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        <div className="grid gap-4 lg:grid-cols-2">
                            {SAMPLE_ITEMS.map((item) => (
                                <Card key={item.id} className="border border-slate-200/80 bg-white shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90">
                                    <CardBody className="flex h-full flex-col gap-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</div>
                                                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.type === 'service' ? 'Услуга' : 'Товар'}</div>
                                            </div>
                                            <Chip size="sm" color={item.status === 'active' ? 'success' : 'warning'} variant="flat">
                                                {item.status === 'active' ? 'Активно' : 'Черновик'}
                                            </Chip>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags.map((tag) => (
                                                <Chip key={tag} size="sm" variant="bordered" className="text-xs">
                                                    {tag}
                                                </Chip>
                                            ))}
                                        </div>
                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.price}</div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="bordered">
                                                    Редактировать
                                                </Button>
                                                <Button size="sm" color="primary" variant="flat">
                                                    Открыть
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4">
                            <Card className="border border-slate-200/80 bg-white shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90">
                                <CardBody className="flex flex-col gap-3">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Сводка каталога</div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center justify-between rounded-medium bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-[#1a1a1f] dark:text-slate-300">
                                            <span>Всего позиций</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">12</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-medium bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-[#1a1a1f] dark:text-slate-300">
                                            <span>Активные</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">8</span>
                                        </div>
                                        <div className="flex items-center justify-between rounded-medium bg-slate-50 px-3 py-2 text-sm text-slate-600 dark:bg-[#1a1a1f] dark:text-slate-300">
                                            <span>Черновики</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">4</span>
                                        </div>
                                    </div>
                                    <Button variant="bordered" startContent={<Icon icon="solar:document-text-linear" className="text-lg" />}>
                                        Сформировать подборку
                                    </Button>
                                </CardBody>
                            </Card>

                            <Card className="border border-slate-200/80 bg-white shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90">
                                <CardBody className="flex flex-col gap-3">
                                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Подсказки</div>
                                    <div className="rounded-medium bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:bg-[#1a1a1f] dark:text-slate-300">
                                        Добавьте описание, цену и ключевые теги — так ассистент точнее отвечает на вопросы клиентов.
                                    </div>
                                    <div className="rounded-medium bg-slate-50 px-3 py-3 text-xs text-slate-500 dark:bg-[#1a1a1f] dark:text-slate-300">
                                        Каталог можно импортировать из Excel или CSV. Мы автоматически распознаем структуру.
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}

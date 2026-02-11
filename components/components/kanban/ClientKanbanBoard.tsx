import React from 'react';
import { router } from '@inertiajs/react';
import {
    Button,
    Card,
    CardBody,
    Chip,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';

export type KanbanColumn = {
    key: string;
    title: string;
};

export type KanbanItem = {
    id: number | string;
    name: string;
    phone?: string | null;
    service?: string | null;
    question?: string | null;
    amount?: number | null;
    currency?: string | null;
    source?: string | null;
    status: string;
    createdAt?: string | null;
    notes?: string | null;
    chatId?: number | null;
};

type KanbanUpdatePayload = {
    name?: string;
    phone?: string | null;
    service?: string | null;
    question?: string | null;
    amount?: number | null;
    source?: string | null;
    notes?: string | null;
    status?: string;
};

type ClientKanbanBoardProps = {
    title: string;
    description: string;
    columns: KanbanColumn[];
    items: KanbanItem[];
    showQuestionField?: boolean;
    onUpdateItem: (id: KanbanItem['id'], payload: KanbanUpdatePayload) => Promise<KanbanItem | null>;
    onDeleteItem: (id: KanbanItem['id']) => Promise<boolean>;
};

type EditForm = {
    name: string;
    phone: string;
    service: string;
    question: string;
    amount: string;
    source: string;
    notes: string;
};

function formatChannelLabel(source?: string | null): string {
    if (!source) return 'Web';
    const channel = source.toLowerCase();
    if (channel === 'instagram') return 'IG';
    if (channel === 'telegram') return 'TG';
    if (channel === 'whatsapp') return 'WA';
    if (channel === 'web') return 'Web';
    return source;
}

function sourceIcon(source?: string | null): string {
    if (!source) return 'solar:globe-linear';
    const channel = source.toLowerCase();
    if (channel === 'instagram') return 'mdi:instagram';
    if (channel === 'telegram') return 'mdi:telegram';
    if (channel === 'whatsapp') return 'mdi:whatsapp';
    return 'solar:globe-linear';
}

function statusButtonLabel(nextKey: string): string {
    if (nextKey === 'processing') return 'В обработку';
    if (nextKey === 'done' || nextKey === 'resolved') return 'Завершить';
    return 'Переместить';
}

function statusLabel(status?: string): string {
    if (!status) return '-';
    const value = status.toLowerCase();
    if (value === 'new') return 'Новый';
    if (value === 'open') return 'Открыт';
    if (value === 'processing') return 'В обработке';
    if (value === 'done') return 'Завершен';
    if (value === 'resolved') return 'Решен';
    return status;
}

function getInitialForm(item: KanbanItem | null): EditForm {
    return {
        name: item?.name ?? '',
        phone: item?.phone ?? '',
        service: item?.service ?? '',
        question: item?.question ?? '',
        amount: String(item?.amount ?? ''),
        source: item?.source ?? '',
        notes: item?.notes ?? '',
    };
}

export default function ClientKanbanBoard({
    title,
    description,
    columns,
    items,
    showQuestionField = false,
    onUpdateItem,
    onDeleteItem,
}: ClientKanbanBoardProps) {
    const [boardItems, setBoardItems] = React.useState<KanbanItem[]>(items);
    const [selectedColumn, setSelectedColumn] = React.useState<string>(columns[0]?.key ?? '');
    const [selectedItem, setSelectedItem] = React.useState<KanbanItem | null>(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = React.useState(false);
    const [editForm, setEditForm] = React.useState<EditForm>(getInitialForm(null));
    const [processing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        setBoardItems(items);
    }, [items]);

    React.useEffect(() => {
        if (!columns.find((column) => column.key === selectedColumn)) {
            setSelectedColumn(columns[0]?.key ?? '');
        }
    }, [columns, selectedColumn]);

    const grouped = React.useMemo(() => {
        return columns.map((column) => ({
            ...column,
            items: boardItems.filter((item) => item.status === column.key),
        }));
    }, [boardItems, columns]);

    const upsertItem = (updated: KanbanItem) => {
        setBoardItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSelectedItem(updated);
    };

    const openDetails = (item: KanbanItem) => {
        setSelectedItem(item);
        setEditForm(getInitialForm(item));
        setIsEditing(false);
        setIsOpen(true);
    };

    const moveItem = async (item: KanbanItem) => {
        const currentIndex = columns.findIndex((column) => column.key === item.status);
        const nextColumn = columns[currentIndex + 1];
        if (!nextColumn) return;

        setProcessing(true);
        try {
            const updated = await onUpdateItem(item.id, { status: nextColumn.key });
            if (updated) {
                upsertItem(updated);
            }
        } finally {
            setProcessing(false);
        }
    };

    const saveEdit = async () => {
        if (!selectedItem) return;
        setProcessing(true);
        try {
            const updated = await onUpdateItem(selectedItem.id, {
                name: editForm.name,
                phone: editForm.phone || null,
                service: editForm.service || null,
                question: showQuestionField ? editForm.question || null : null,
                amount: showQuestionField ? null : Number(editForm.amount || 0),
                source: editForm.source || null,
                notes: editForm.notes || null,
            });
            if (updated) {
                upsertItem(updated);
                setEditForm(getInitialForm(updated));
                setIsEditing(false);
            }
        } finally {
            setProcessing(false);
        }
    };

    const confirmDelete = async () => {
        if (!selectedItem) return;
        setProcessing(true);
        try {
            const ok = await onDeleteItem(selectedItem.id);
            if (ok) {
                setBoardItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
                setSelectedItem(null);
                setIsDeleteConfirmOpen(false);
                setIsOpen(false);
            }
        } finally {
            setProcessing(false);
        }
    };

    const renderCard = (item: KanbanItem) => {
        const currentIndex = columns.findIndex((column) => column.key === item.status);
        const nextColumn = columns[currentIndex + 1];

        return (
            <Card key={item.id} className="border border-default-200/90 bg-white shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                <CardBody className="gap-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold leading-6 text-default-900 dark:text-default-100">{item.name}</h3>
                        <Chip
                            size="sm"
                            color="primary"
                            variant="flat"
                            startContent={<Icon icon={sourceIcon(item.source)} width={14} />}
                            className="capitalize"
                        >
                            {formatChannelLabel(item.source)}
                        </Chip>
                    </div>

                    <p className="text-sm text-default-500">{item.phone ?? 'Телефон не указан'}</p>

                    <div className="flex items-center gap-2 text-default-700 dark:text-default-300">
                        <Icon icon="solar:case-minimalistic-linear" width={16} />
                        <span className="text-sm">{item.service ?? 'Без категории'}</span>
                    </div>

                    {showQuestionField && item.question ? (
                        <p className="line-clamp-2 rounded-medium bg-default-50 px-3 py-2 text-sm text-default-700 dark:bg-[#1f1f24] dark:text-default-300">
                            {item.question}
                        </p>
                    ) : null}

                    <Divider />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Icon icon="solar:dollar-minimalistic-linear" width={20} />
                            <span className="text-4xl font-bold leading-none">{Math.round(item.amount ?? 0)}</span>
                        </div>
                        <span className="text-sm text-default-500">{item.createdAt ?? '-'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="flat" color="default" onPress={() => openDetails(item)}>
                            Подробно
                        </Button>
                        <Button color="primary" onPress={() => moveItem(item)} isDisabled={!nextColumn || processing}>
                            {nextColumn ? statusButtonLabel(nextColumn.key) : 'Завершено'}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <div>
                    <h1 className="text-xl font-semibold text-default-900 dark:text-default-100">{title}</h1>
                    <p className="text-sm text-default-500">{description}</p>
                </div>

                <div className="lg:hidden">
                    <Tabs
                        selectedKey={selectedColumn}
                        onSelectionChange={(key) => setSelectedColumn(String(key))}
                        variant="bordered"
                        color="primary"
                        fullWidth
                    >
                        {columns.map((column) => (
                            <Tab key={column.key} title={column.title}>
                                <div className="mt-4 flex flex-col gap-3">{grouped.find((x) => x.key === column.key)?.items.map(renderCard)}</div>
                            </Tab>
                        ))}
                    </Tabs>
                </div>

                <div className="hidden gap-4 lg:grid lg:grid-cols-3">
                    {grouped.map((column) => (
                        <div
                            key={column.key}
                            className="flex min-h-[300px] flex-col gap-3 rounded-large border border-default-200/90 bg-default-50/70 p-3 dark:border-[#2a2a32] dark:bg-[#15151a]"
                        >
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-sm font-semibold text-default-700 dark:text-default-200">{column.title}</h2>
                                <Chip size="sm" variant="flat" color="primary">
                                    {column.items.length}
                                </Chip>
                            </div>
                            <div className="flex flex-col gap-3">{column.items.map(renderCard)}</div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="3xl">
                <ModalContent>
                    <ModalHeader className="text-4xl font-semibold">{selectedItem?.name}</ModalHeader>
                    <ModalBody className="gap-5">
                        {isEditing ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Input label="Имя" value={editForm.name} onValueChange={(value) => setEditForm((prev) => ({ ...prev, name: value }))} />
                                <Input label="Телефон" value={editForm.phone} onValueChange={(value) => setEditForm((prev) => ({ ...prev, phone: value }))} />
                                <Input label="Услуга" value={editForm.service} onValueChange={(value) => setEditForm((prev) => ({ ...prev, service: value }))} />
                                <Input
                                    label="Источник"
                                    value={editForm.source}
                                    onValueChange={(value) => setEditForm((prev) => ({ ...prev, source: value }))}
                                />
                                {!showQuestionField ? (
                                    <Input
                                        label="Сумма"
                                        type="number"
                                        value={editForm.amount}
                                        onValueChange={(value) => setEditForm((prev) => ({ ...prev, amount: value }))}
                                    />
                                ) : null}
                                {showQuestionField ? (
                                    <Textarea
                                        label="Вопрос"
                                        className="sm:col-span-2"
                                        value={editForm.question}
                                        onValueChange={(value) => setEditForm((prev) => ({ ...prev, question: value }))}
                                    />
                                ) : null}
                                <Textarea
                                    label="Заметка"
                                    className="sm:col-span-2"
                                    value={editForm.notes}
                                    onValueChange={(value) => setEditForm((prev) => ({ ...prev, notes: value }))}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-default-500">Телефон</p>
                                        <p className="text-xl font-semibold">{selectedItem?.phone ?? '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Услуга</p>
                                        <p className="text-xl font-semibold">{selectedItem?.service ?? '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Сумма</p>
                                        <p className="text-xl font-semibold">{Math.round(selectedItem?.amount ?? 0)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Статус</p>
                                        <p className="text-xl font-semibold">{statusLabel(selectedItem?.status)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Источник</p>
                                        <p className="text-xl font-semibold">{selectedItem ? formatChannelLabel(selectedItem.source) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-default-500">Дата</p>
                                        <p className="text-xl font-semibold">{selectedItem?.createdAt ?? '-'}</p>
                                    </div>
                                </div>
                                {showQuestionField && selectedItem?.question ? (
                                    <div>
                                        <p className="text-sm text-default-500">Текст вопроса</p>
                                        <p className="mt-1 rounded-medium bg-default-50 px-3 py-2 text-base dark:bg-[#1f1f24]">
                                            {selectedItem.question}
                                        </p>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                        {isEditing ? (
                            <Button color="primary" variant="solid" onPress={saveEdit} isDisabled={processing}>
                                Сохранить
                            </Button>
                        ) : (
                            <Button color="primary" variant="solid" onPress={() => setIsEditing(true)}>
                                Редактировать
                            </Button>
                        )}
                        <Button
                            color="success"
                            variant="solid"
                            onPress={() => {
                                if (!selectedItem?.chatId) return;
                                router.get('/client-chats', { chat: selectedItem.chatId });
                            }}
                            isDisabled={!selectedItem?.chatId}
                        >
                            Открыть чат
                        </Button>
                        <Button color="danger" isIconOnly onPress={() => setIsDeleteConfirmOpen(true)}>
                            <Icon icon="solar:trash-bin-trash-linear" width={20} />
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen} size="sm">
                <ModalContent>
                    <ModalHeader>Подтверждение удаления</ModalHeader>
                    <ModalBody>
                        <p className="text-sm text-default-600">
                            Удалить карточку <span className="font-semibold">{selectedItem?.name ?? ''}</span>? Это действие необратимо.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={() => setIsDeleteConfirmOpen(false)}>
                            Отмена
                        </Button>
                        <Button color="danger" onPress={confirmDelete} isDisabled={processing}>
                            Удалить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

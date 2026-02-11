import React from 'react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

type AssistantFile = {
    name: string;
    size?: number | null;
    mime?: string | null;
    openai_file_id?: string | null;
};

type AssistantForm = {
    name: string;
    instructions: string;
    files: File[];
    limits: string;
    tools: string[];
    quickAnswers: { trigger: string; answer: string }[];
};

type AssistantCard = {
    id: number | string;
    name: string;
    status: 'active' | 'draft';
    updatedAt: string;
    instructions?: string | null;
    limits?: string | null;
    files?: AssistantFile[];
    tools?: string[];
};

const DEFAULT_FORM: AssistantForm = {
    name: '',
    instructions: '',
    files: [],
    limits: 'Ответы до 800 символов. Без личных данных.',
    tools: ['file_search'],
    quickAnswers: [],
};

export default function AssistantTraining() {
    const { props } = usePage<{ assistants?: AssistantCard[]; csrf_token?: string }>();
    const assistants = props.assistants ?? [];
    const csrfToken = props.csrf_token ?? document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';

    const [selected, setSelected] = React.useState<AssistantCard | null>(null);
    const [mobileView, setMobileView] = React.useState<'list' | 'form'>('list');
    const [existingFiles, setExistingFiles] = React.useState<AssistantFile[]>([]);
    const [removedExistingFileIds, setRemovedExistingFileIds] = React.useState<string[]>([]);
    const [removedExistingFileNames, setRemovedExistingFileNames] = React.useState<string[]>([]);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [deleteTarget, setDeleteTarget] = React.useState<AssistantCard | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const { data, setData, post, processing, errors, reset, transform, clearErrors } = useForm({
        _token: csrfToken,
        name: DEFAULT_FORM.name,
        instructions: DEFAULT_FORM.instructions,
        limits: DEFAULT_FORM.limits,
        files: [] as File[],
        tools: DEFAULT_FORM.tools,
        quickAnswers: [] as { trigger: string; answer: string }[],
    });

    const handleFilesChange = (files: FileList | null) => {
        if (!files) return;
        const incoming = Array.from(files);
        const existingKeys = new Set(data.files.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
        const merged = [...data.files];
        incoming.forEach((file) => {
            const key = `${file.name}-${file.size}-${file.lastModified}`;
            if (!existingKeys.has(key)) {
                merged.push(file);
            }
        });
        setData('files', merged);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSelect = (assistant: AssistantCard) => {
        setSelected(assistant);
        setData('name', assistant.name ?? '');
        setData('instructions', assistant.instructions ?? '');
        setData('limits', assistant.limits ?? DEFAULT_FORM.limits);
        setData('files', []);
        setData('tools', assistant.tools && assistant.tools.length > 0 ? assistant.tools : DEFAULT_FORM.tools);
        setData('quickAnswers', assistant.quickAnswers ?? []);
        setExistingFiles(assistant.files ?? []);
        setRemovedExistingFileIds([]);
        setRemovedExistingFileNames([]);
        clearErrors();
        setMobileView('form');
    };

    const handleReset = () => {
        reset('name', 'instructions', 'limits', 'files', 'tools', 'quickAnswers');
        setData('name', '');
        setData('instructions', '');
        setData('limits', DEFAULT_FORM.limits);
        setData('files', []);
        setData('tools', DEFAULT_FORM.tools);
        setData('quickAnswers', []);
        setExistingFiles([]);
        setRemovedExistingFileIds([]);
        setRemovedExistingFileNames([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCreateNew = () => {
        setSelected({
            id: 'new',
            name: '',
            status: 'draft',
            updatedAt: 'Только что',
        });
        handleReset();
        setMobileView('form');
    };

    const removeFile = (index: number) => {
        setData(
            'files',
            data.files.filter((_, idx) => idx !== index),
        );
    };

    const addQuickAnswer = () => {
        setData('quickAnswers', [...data.quickAnswers, { trigger: '', answer: '' }]);
    };

    const updateQuickAnswer = (index: number, field: 'trigger' | 'answer', value: string) => {
        const next = data.quickAnswers.map((item, idx) => (idx === index ? { ...item, [field]: value } : item));
        setData('quickAnswers', next);
    };

    const removeQuickAnswer = (index: number) => {
        setData('quickAnswers', data.quickAnswers.filter((_, idx) => idx !== index));
    };

    const removeExistingFile = (index: number) => {
        const fileToRemove = existingFiles[index];
        if (!fileToRemove) return;

        setExistingFiles((prev) => prev.filter((_, idx) => idx !== index));

        if (fileToRemove.openai_file_id) {
            setRemovedExistingFileIds((prev) => [...new Set([...prev, fileToRemove.openai_file_id as string])]);
        } else if (fileToRemove.name) {
            setRemovedExistingFileNames((prev) => [...new Set([...prev, fileToRemove.name])]);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const isUpdate = Boolean(selected && selected.id !== 'new');

        transform((formData) => ({
            ...formData,
            _method: isUpdate ? 'patch' : 'post',
            keep_file_ids: existingFiles.map((file) => file.openai_file_id).filter((id): id is string => Boolean(id)),
            keep_file_names: existingFiles.filter((file) => !file.openai_file_id && file.name).map((file) => file.name),
            remove_file_ids: removedExistingFileIds,
            remove_file_names: removedExistingFileNames,
            quick_answers: data.quickAnswers,
        }));

        post(isUpdate ? `/assistant/training/${selected?.id}` : '/assistant/training', {
            forceFormData: true,
            onSuccess: () => {
                handleReset();
                setSelected(null);
                setMobileView('list');
            },
            onFinish: () => {
                transform((formData) => formData);
            },
        });
    };

    const toggleAssistantStatus = (assistantId: number | string) => {
        router.patch(
            `/assistant/training/${assistantId}/status`,
            { _token: csrfToken },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['assistants'] });
                },
            },
        );
    };

    const deleteAssistant = (assistantId: number | string) => {
        router.delete(`/assistant/training/${assistantId}`, {
            data: { _token: csrfToken },
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['assistants'] });
            },
        });
        if (selected?.id === assistantId) {
            setSelected(null);
            setMobileView('list');
        }
    };

    const openDeleteModal = (assistant: AssistantCard) => {
        setDeleteTarget(assistant);
        setIsDeleteOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setDeleteTarget(null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteAssistant(deleteTarget.id);
        closeDeleteModal();
    };

    return (
        <>
            <Head title="Обучение ассистента" />
            <DashboardLayout title="Обучение ассистента" defaultSelectedKey="assistant-training">
                <div className="flex w-full flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Создайте ассистента, настройте инструкции и добавьте материалы для обучения. После сохранения данные можно обновлять.
                        </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
                        <div className={`${mobileView === 'form' ? 'hidden xl:block' : 'block'}`}>
                            <Card className={`border border-slate-200/80 bg-white p-4 shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                        <Icon icon="solar:chat-square-bold" className="text-lg" />
                                        Ваши ассистенты
                                    </div>
                                    <Button size="sm" variant="bordered" onPress={handleCreateNew}>
                                        Новый
                                    </Button>
                                </div>
                                <div className="mt-3 flex flex-col gap-3">
                                    {assistants.map((assistant) => (
                                        <div
                                            key={assistant.id}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => handleSelect(assistant)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' || event.key === ' ') {
                                                    event.preventDefault();
                                                    handleSelect(assistant);
                                                }
                                            }}
                                            className={`flex w-full cursor-pointer flex-col gap-2 rounded-large border px-3 py-3 text-left transition ${
                                                selected?.id === assistant.id
                                                    ? 'border-primary-500/60 bg-primary-50 text-slate-900 shadow-sm dark:bg-primary-500/10 dark:text-slate-100'
                                                    : 'border-slate-200/80 bg-white text-slate-700 hover:border-primary-200 dark:border-[#2a2a32]/80 dark:bg-[#17171b] dark:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold">{assistant.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="solid"
                                                        color="primary"
                                                        aria-label="Пауза"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            toggleAssistantStatus(assistant.id);
                                                        }}
                                                    >
                                                        <Icon
                                                            icon={
                                                                assistant.status === 'active'
                                                                    ? 'solar:pause-circle-linear'
                                                                    : 'solar:play-circle-linear'
                                                            }
                                                            className="text-xl text-white"
                                                        />
                                                    </Button>
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="solid"
                                                        color="primary"
                                                        aria-label="Удалить"
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            openDeleteModal(assistant);
                                                        }}
                                                    >
                                                        <Icon icon="solar:trash-bin-minimalistic-linear" className="text-xl" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">{assistant.updatedAt}</span>
                                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                <span>Документы: {assistant.files?.length ?? 0}</span>
                                                <span>Функции: {(assistant.tools ?? []).length || 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                    {assistants.length === 0 && (
                                        <div className="rounded-large border border-dashed border-slate-200 px-3 py-6 text-center text-sm text-slate-500">
                                            Ассистентов пока нет.
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {selected ? (
                            <Card
                                className={`border border-slate-200/80 bg-white shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90 ${
                                    mobileView === 'list' ? 'hidden xl:flex' : 'flex'
                                }`}
                            >
                                <CardHeader className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                        <Icon icon="solar:settings-bold" className="text-2xl" />
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                    Редактирование ассистента
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Заполните основные настройки, добавьте инструкции и материалы.
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        className="text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white"
                                        aria-label="Назад"
                                        onPress={() => {
                                            setSelected(null);
                                            setMobileView('list');
                                        }}
                                    >
                                        <Icon icon="solar:alt-arrow-left-linear" className="text-lg" />
                                    </Button>
                                </CardHeader>
                                <CardBody className="flex flex-col gap-5">
                                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                        <Input
                                            isRequired
                                            label="Имя ассистента"
                                            labelPlacement="outside"
                                            placeholder="Например: Ассистент продаж"
                                            variant="bordered"
                                            value={data.name}
                                            isInvalid={Boolean(errors.name)}
                                            errorMessage={errors.name}
                                            onValueChange={(value) => setData('name', value)}
                                        />
                                        <Textarea
                                            label="Инструкции"
                                            labelPlacement="outside"
                                            placeholder="Опишите стиль общения, цели и ограничения."
                                            variant="bordered"
                                            minRows={4}
                                            value={data.instructions}
                                            isInvalid={Boolean(errors.instructions)}
                                            errorMessage={errors.instructions}
                                            onValueChange={(value) => setData('instructions', value)}
                                        />
                                        <div className="flex flex-col gap-3">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Файлы для обучения</label>
                                            <div className="rounded-large border border-dashed border-slate-200 bg-white p-4 shadow-sm dark:border-[#2a2a32] dark:bg-[#17171b]">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        multiple
                                                        accept=".txt,.md,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                                                        className="hidden"
                                                        onChange={(event) => handleFilesChange(event.target.files)}
                                                    />
                                                    <Button
                                                        color="primary"
                                                        variant="flat"
                                                        startContent={<Icon icon="solar:add-circle-linear" className="text-lg" />}
                                                        onPress={() => fileInputRef.current?.click()}
                                                    >
                                                        Добавить файлы
                                                    </Button>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">TXT, PDF, Word, Excel, CSV</span>
                                                </div>
                                                {errors.files && (
                                                    <div className="mt-3 rounded-medium border border-danger-200 bg-danger-50 px-3 py-2 text-xs text-danger-700">
                                                        {errors.files}
                                                    </div>
                                                )}
                                                {existingFiles.length === 0 && data.files.length === 0 ? (
                                                    <div className="mt-3 rounded-medium bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-[#1f1f24] dark:text-slate-400">
                                                        Файлы не выбраны. Можно добавить несколько файлов подряд.
                                                    </div>
                                                ) : (
                                                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                                        {existingFiles.map((file, index) => (
                                                            <div
                                                                key={`${file.name}-${file.openai_file_id ?? 'local'}`}
                                                                className="flex items-center justify-between gap-2 rounded-medium border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-[#2a2a32] dark:bg-[#1a1a1f] dark:text-slate-200"
                                                            >
                                                                <div className="flex min-w-0 items-center gap-2">
                                                                    <Icon icon="solar:document-text-linear" className="text-base text-slate-500" />
                                                                    <div className="min-w-0">
                                                                        <div className="truncate font-medium">{file.name}</div>
                                                                        {file.size ? (
                                                                            <div className="text-[11px] text-slate-400">
                                                                                {(file.size / 1024).toFixed(1)} KB
                                                                            </div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] text-slate-400">Загружено</span>
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="light"
                                                                    aria-label="Удалить файл"
                                                                    onPress={() => removeExistingFile(index)}
                                                                >
                                                                    <Icon
                                                                        icon="solar:trash-bin-minimalistic-linear"
                                                                        className="text-base text-slate-500"
                                                                    />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                        {data.files.map((file, index) => (
                                                            <div
                                                                key={`${file.name}-${file.size}-${file.lastModified}`}
                                                                className="flex items-center justify-between gap-2 rounded-medium border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-[#2a2a32] dark:bg-[#1a1a1f] dark:text-slate-200"
                                                            >
                                                                <div className="flex min-w-0 items-center gap-2">
                                                                    <Icon icon="solar:document-text-linear" className="text-base text-slate-500" />
                                                                    <div className="min-w-0">
                                                                        <div className="truncate font-medium">{file.name}</div>
                                                                        <div className="text-[11px] text-slate-400">
                                                                            {(file.size / 1024).toFixed(1)} KB
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="light"
                                                                    aria-label="Удалить файл"
                                                                    onPress={() => removeFile(index)}
                                                                >
                                                                    <Icon
                                                                        icon="solar:trash-bin-minimalistic-linear"
                                                                        className="text-base text-slate-500"
                                                                    />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Функции ассистента</label>
                                            <div className="flex flex-wrap gap-4">
                                                <Checkbox
                                                    size="sm"
                                                    isSelected={data.tools.includes('file_search')}
                                                    onValueChange={(checked) => {
                                                        const next = checked
                                                            ? [...new Set([...data.tools, 'file_search'])]
                                                            : data.tools.filter((tool) => tool !== 'file_search');
                                                        setData('tools', next);
                                                    }}
                                                >
                                                    Поиск по файлам
                                                </Checkbox>
                                                <Checkbox
                                                    size="sm"
                                                    isSelected={data.tools.includes('code_interpreter')}
                                                    onValueChange={(checked) => {
                                                        const next = checked
                                                            ? [...new Set([...data.tools, 'code_interpreter'])]
                                                            : data.tools.filter((tool) => tool !== 'code_interpreter');
                                                        setData('tools', next);
                                                    }}
                                                >
                                                    Анализ данных
                                                </Checkbox>
                                                <Checkbox
                                                    size="sm"
                                                    isSelected={data.tools.includes('tts')}
                                                    onValueChange={(checked) => {
                                                        const next = checked
                                                            ? [...new Set([...data.tools, 'tts'])]
                                                            : data.tools.filter((tool) => tool !== 'tts');
                                                        setData('tools', next);
                                                    }}
                                                >
                                                    Озвучивание ответов
                                                </Checkbox>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Быстрые ответы</label>
                                            {data.quickAnswers.length > 0 ? (
                                                <div className="flex flex-col gap-3">
                                                    {data.quickAnswers.map((item, index) => (
                                                        <div key={`qa-${index}`} className="flex flex-wrap items-center gap-3">
                                                            <Input
                                                                labelPlacement="outside"
                                                                placeholder="Триггер"
                                                                variant="bordered"
                                                                className="min-w-[200px] flex-1"
                                                                value={item.trigger}
                                                                onValueChange={(value) => updateQuickAnswer(index, 'trigger', value)}
                                                            />
                                                            <Input
                                                                labelPlacement="outside"
                                                                placeholder="Ответ"
                                                                variant="bordered"
                                                                className="min-w-[260px] flex-[2]"
                                                                value={item.answer}
                                                                onValueChange={(value) => updateQuickAnswer(index, 'answer', value)}
                                                            />
                                                            <Button
                                                                isIconOnly
                                                                size="sm"
                                                                variant="light"
                                                                aria-label="Удалить быстрый ответ"
                                                                onPress={() => removeQuickAnswer(index)}
                                                            >
                                                                <Icon icon="solar:close-circle-linear" className="text-lg text-rose-500" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="rounded-medium bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-[#1f1f24] dark:text-slate-400">
                                                    Добавьте шаблонные пары «триггер → ответ», чтобы ассистент быстро отвечал на типовые вопросы.
                                                </div>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="light"
                                                className="w-fit text-primary-600"
                                                onPress={addQuickAnswer}
                                            >
                                                + Добавить быстрый ответ
                                            </Button>
                                        </div>
                                        <Textarea
                                            label="Ограничения ответа"
                                            labelPlacement="outside"
                                            placeholder="Например: не обсуждать персональные данные."
                                            variant="bordered"
                                            minRows={2}
                                            value={data.limits}
                                            isInvalid={Boolean(errors.limits)}
                                            errorMessage={errors.limits}
                                            onValueChange={(value) => setData('limits', value)}
                                        />
                                        <div className="flex flex-wrap gap-3">
                                            <Button color="primary" type="submit" isDisabled={processing}>
                                                {selected?.id && selected.id !== 'new' ? 'Обновить ассистента' : 'Создать ассистента'}
                                            </Button>
                                            <Button variant="bordered" onPress={handleReset}>
                                                Сбросить форму
                                            </Button>
                                        </div>
                                    </form>
                                </CardBody>
                            </Card>
                        ) : (
                            <Card
                                className={`flex items-center justify-center border border-dashed border-slate-200/80 bg-white/70 p-10 text-center shadow-sm dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/70 ${
                                    mobileView === 'list' ? 'hidden xl:flex' : 'flex'
                                }`}
                            >
                                <div className="flex max-w-md flex-col items-center gap-3 text-slate-600 dark:text-slate-300">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300">
                                        <Icon icon="solar:add-square-linear" className="text-2xl" />
                                    </div>
                                    <p className="text-sm">Пока ассистент не выбран. Выберите существующего слева или создайте нового.</p>
                                    <Button color="primary" onPress={handleCreateNew}>
                                        Создать ассистента
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </DashboardLayout>
            <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} size="sm">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Удалить ассистента</ModalHeader>
                            <ModalBody>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Вы точно хотите удалить{' '}
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">{deleteTarget?.name ?? 'ассистента'}</span>?
                                    Это действие нельзя отменить.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="bordered" onPress={closeDeleteModal}>
                                    Нет
                                </Button>
                                <Button color="primary" onPress={confirmDelete}>
                                    Да, удалить
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button, Input, Textarea } from '@heroui/react';
import ThemeToggle from '../../components/ThemeToggle';

export default function CompanyCreate() {
    const { props } = usePage();
    const csrfToken =
        (props as { csrf_token?: string }).csrf_token ??
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
        '';
    const { data, setData, post, processing, errors } = useForm({
        _token: csrfToken,
        name: '',
        phone: '',
        industry: '',
        description: '',
        usage_reason: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/company');
    };

    return (
        <>
            <Head title="Создание компании" />
            <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 dark:from-[#17171b] dark:to-[#17171b]">
                <div className="absolute right-6 top-6">
                    <ThemeToggle />
                </div>
                <div className="flex w-full max-w-2xl flex-col gap-4 rounded-large border border-slate-200/80 bg-white px-8 pb-10 pt-6 shadow-xl shadow-slate-200/60 dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90 dark:shadow-none">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Создайте компанию</h1>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Заполните информацию о компании. После проверки администратором доступ к дашборду будет активирован.
                        </p>
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={submit}>
                        <Input
                            isRequired
                            label="Название компании"
                            labelPlacement="outside"
                            name="name"
                            placeholder="Введите название компании"
                            type="text"
                            variant="bordered"
                            value={data.name}
                            onValueChange={(value) => setData('name', value)}
                            isInvalid={Boolean(errors.name)}
                            errorMessage={errors.name}
                        />
                        <Input
                            label="Телефон для связи"
                            labelPlacement="outside"
                            name="phone"
                            placeholder="Введите номер телефона"
                            type="tel"
                            variant="bordered"
                            value={data.phone}
                            onValueChange={(value) => setData('phone', value)}
                            isInvalid={Boolean(errors.phone)}
                            errorMessage={errors.phone}
                        />
                        <Input
                            label="Отрасль"
                            labelPlacement="outside"
                            name="industry"
                            placeholder="Например: услуги, торговля, образование"
                            type="text"
                            variant="bordered"
                            value={data.industry}
                            onValueChange={(value) => setData('industry', value)}
                            isInvalid={Boolean(errors.industry)}
                            errorMessage={errors.industry}
                        />
                        <Textarea
                            label="Краткое описание компании"
                            labelPlacement="outside"
                            name="description"
                            placeholder="Чем занимается ваша компания?"
                            variant="bordered"
                            minRows={3}
                            value={data.description}
                            onValueChange={(value) => setData('description', value)}
                            isInvalid={Boolean(errors.description)}
                            errorMessage={errors.description}
                        />
                        <Textarea
                            label="Цель использования продукта"
                            labelPlacement="outside"
                            name="usage_reason"
                            placeholder="Что вы хотите улучшить с помощью TexHub?"
                            variant="bordered"
                            minRows={3}
                            value={data.usage_reason}
                            onValueChange={(value) => setData('usage_reason', value)}
                            isInvalid={Boolean(errors.usage_reason)}
                            errorMessage={errors.usage_reason}
                        />
                        <Button color="primary" type="submit" isLoading={processing}>
                            Отправить на проверку
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}

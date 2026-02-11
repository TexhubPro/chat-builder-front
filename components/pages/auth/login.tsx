import React from 'react';
import { Head, Link as InertiaLink, useForm, usePage } from '@inertiajs/react';
import { Button, Checkbox, Input, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import ThemeToggle from '../../components/ThemeToggle';

export default function Login() {
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const { props } = usePage();
    const csrfToken =
        (props as { csrf_token?: string }).csrf_token ??
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
        '';
    const { data, setData, post, processing, errors, reset } = useForm({
        _token: csrfToken,
        email: '',
        password: '',
        remember: false,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/login', {
            onSuccess: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Вход" />
            <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 dark:from-[#17171b] dark:to-[#17171b]">
                <div className="absolute right-6 top-6">
                    <ThemeToggle />
                </div>
                <div className="rounded-large flex w-full max-w-sm flex-col gap-4 border border-slate-200/80 bg-white px-8 pb-10 pt-6 shadow-xl shadow-slate-200/60 dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90 dark:shadow-none">
                    <p className="pb-2 text-left text-3xl font-semibold text-slate-900 dark:text-slate-100">Вход</p>
                    <form className="flex flex-col gap-4" onSubmit={submit}>
                        <Input
                            isRequired
                            label="Email"
                            labelPlacement="outside"
                            name="email"
                            placeholder="Введите email"
                            type="email"
                            variant="bordered"
                            value={data.email}
                            onValueChange={(value) => setData('email', value)}
                            isInvalid={Boolean(errors.email)}
                            errorMessage={errors.email}
                        />
                        <Input
                            isRequired
                            endContent={
                                <button type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                    ) : (
                                        <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                    )}
                                </button>
                            }
                            label="Пароль"
                            labelPlacement="outside"
                            name="password"
                            placeholder="Введите пароль"
                            type={isVisible ? 'text' : 'password'}
                            variant="bordered"
                            value={data.password}
                            onValueChange={(value) => setData('password', value)}
                            isInvalid={Boolean(errors.password)}
                            errorMessage={errors.password}
                        />
                        <div className="flex items-center justify-between">
                            <Checkbox
                                className="py-1"
                                name="remember"
                                size="sm"
                                isSelected={data.remember}
                                onValueChange={(value) => setData('remember', value)}
                            >
                                Запомнить меня
                            </Checkbox>
                            <Link href="#" size="sm">
                                Забыли пароль?
                            </Link>
                        </div>
                        <Button color="primary" type="submit" isLoading={processing}>
                            Войти
                        </Button>
                    </form>

                    <div className="flex items-center gap-4 text-xs text-default-400">
                        <span className="h-px flex-1 bg-default-200" />
                        ИЛИ
                        <span className="h-px flex-1 bg-default-200" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button variant="bordered" startContent={<Icon icon="flat-color-icons:google" className="text-xl" />}>
                            Продолжить с Google
                        </Button>
                        <Button variant="bordered" startContent={<Icon icon="mdi:github" className="text-xl text-slate-700" />}>
                            Продолжить с GitHub
                        </Button>
                    </div>

                    <p className="text-center text-small">
                        <Link as={InertiaLink} href="/register" size="sm">
                            Нет аккаунта? Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

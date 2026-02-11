import React from 'react';
import { Head, Link as InertiaLink, useForm, usePage } from '@inertiajs/react';
import { Button, Checkbox, Input, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import ThemeToggle from '../../components/ThemeToggle';

export default function Register() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
    const { props } = usePage();
    const csrfToken =
        (props as { csrf_token?: string }).csrf_token ??
        document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ??
        '';
    const { data, setData, post, processing, errors, reset } = useForm({
        _token: csrfToken,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);
    const passwordError = errors.password ?? errors.password_confirmation;

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/register', {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Регистрация" />
            <div className="relative flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 dark:from-[#17171b] dark:to-[#17171b]">
                <div className="absolute right-6 top-6">
                    <ThemeToggle />
                </div>
                <div className="flex w-full max-w-sm flex-col gap-4 rounded-large border border-slate-200/80 bg-white px-8 pb-10 pt-6 shadow-xl shadow-slate-200/60 dark:border-[#2a2a32]/80 dark:bg-[#1f1f24]/90 dark:shadow-none">
                    <p className="pb-2 text-left text-3xl font-semibold text-slate-900 dark:text-slate-100">
                        Регистрация
                        <span aria-label="emoji" className="ml-2" role="img">
                            👋
                        </span>
                    </p>
                    <form className="flex flex-col gap-4" onSubmit={submit}>
                        <Input
                            isRequired
                            label="Имя пользователя"
                            labelPlacement="outside"
                            name="name"
                            placeholder="Введите имя пользователя"
                            type="text"
                            variant="bordered"
                            value={data.name}
                            onValueChange={(value) => setData('name', value)}
                            isInvalid={Boolean(errors.name)}
                            errorMessage={errors.name}
                        />
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
                            isInvalid={Boolean(passwordError)}
                            errorMessage={passwordError}
                        />
                        <Input
                            isRequired
                            endContent={
                                <button type="button" onClick={toggleConfirmVisibility}>
                                    {isConfirmVisible ? (
                                        <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-closed-linear" />
                                    ) : (
                                        <Icon className="pointer-events-none text-2xl text-default-400" icon="solar:eye-bold" />
                                    )}
                                </button>
                            }
                            label="Подтвердите пароль"
                            labelPlacement="outside"
                            name="password_confirmation"
                            placeholder="Повторите пароль"
                            type={isConfirmVisible ? 'text' : 'password'}
                            variant="bordered"
                            value={data.password_confirmation}
                            onValueChange={(value) => setData('password_confirmation', value)}
                            isInvalid={Boolean(passwordError)}
                            errorMessage={passwordError}
                        />
                        <Checkbox isRequired className="py-2" size="sm" isSelected={data.terms} onValueChange={(value) => setData('terms', value)}>
                            Я согласен с&nbsp;
                            <Link className="relative z-1" href="#" size="sm">
                                условиями
                            </Link>
                            &nbsp;и&nbsp;
                            <Link className="relative z-1" href="#" size="sm">
                                политикой конфиденциальности
                            </Link>
                        </Checkbox>
                        <Button color="primary" type="submit" isLoading={processing}>
                            Зарегистрироваться
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
                        <Link as={InertiaLink} href="/login" size="sm">
                            Уже есть аккаунт? Войти
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}

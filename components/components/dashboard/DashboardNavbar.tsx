import type { NavbarProps } from '@heroui/react';

import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar } from '@heroui/react';
import { Icon } from '@iconify/react';
import { cn } from '@heroui/react';

import { router } from '@inertiajs/react';
import ThemeToggle from '../ThemeToggle';

export default function DashboardNavbar(props: NavbarProps) {
    return (
        <Navbar
            {...props}
            className="bg-white shadow-sm dark:bg-[#17171b]"
            classNames={{
                base: cn('border-b border-default-100 bg-white dark:bg-[#17171b]'),
                wrapper: 'w-full max-w-none justify-between bg-white px-4 dark:bg-[#17171b] sm:px-6',
            }}
            height="64px"
        >
            <NavbarBrand className="sm:hidden">
                <img src="/logo/logo-dark.svg" alt="TexHub" className="h-8 w-auto dark:hidden" />
                <img src="/logo/logo-white.svg" alt="TexHub" className="hidden h-8 w-auto dark:block" />
            </NavbarBrand>

            <NavbarContent justify="end">
                <NavbarItem className="flex items-center gap-2">
                    <ThemeToggle />
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar className="cursor-pointer" name="John Doe" size="sm" src="https://i.pravatar.cc/150?u=texhub-user" />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="User menu"
                            className="w-56"
                            classNames={{
                                base: 'bg-white text-slate-900 dark:bg-slate-900/95 dark:text-slate-100',
                            }}
                            itemClasses={{
                                base: 'gap-2 text-slate-700 data-[hover=true]:bg-slate-100 data-[focus=true]:bg-slate-100 dark:text-slate-100 dark:data-[hover=true]:bg-white/10 dark:data-[focus=true]:bg-white/10',
                            }}
                        >
                            <DropdownItem key="profile" startContent={<Icon icon="solar:user-circle-linear" width={20} />}>
                                Профиль
                            </DropdownItem>
                            <DropdownItem key="notifications" startContent={<Icon icon="solar:bell-linear" width={20} />}>
                                Уведомления
                            </DropdownItem>
                            <DropdownItem key="settings" startContent={<Icon icon="solar:settings-outline" width={20} />}>
                                Настройки
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                className="text-rose-500 dark:text-rose-400"
                                startContent={<Icon icon="solar:logout-2-linear" width={20} />}
                                onPress={() => router.post('/logout')}
                            >
                                Выход
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

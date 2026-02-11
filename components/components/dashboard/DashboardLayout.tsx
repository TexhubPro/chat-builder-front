import React from 'react';
import { Button, useDisclosure } from '@heroui/react';
import { Icon } from '@iconify/react';

import DashboardNavbar from './DashboardNavbar';
import Sidebar from './Sidebar';
import SidebarDrawer from './SidebarDrawer';
import { sidebarSections } from './sidebar-items';

type DashboardLayoutProps = {
    title: string;
    header?: React.ReactNode;
    children: React.ReactNode;
    defaultSelectedKey?: string;
    fullBleed?: boolean;
    hideHeader?: boolean;
};

export default function DashboardLayout({
    title,
    header,
    children,
    defaultSelectedKey = 'dashboard',
    fullBleed = false,
    hideHeader = false,
}: DashboardLayoutProps) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const sidebarContent = (
        <div className="relative flex h-full w-72 flex-1 flex-col bg-white/90 p-6 backdrop-blur dark:bg-[#1b1b21]">
            <div className="hidden items-center gap-2 px-2 pb-6 sm:flex">
                <img src="/logo/logo-dark.svg" alt="TexHub" className="h-8 w-auto dark:hidden" />
                <img src="/logo/logo-white.svg" alt="TexHub" className="hidden h-8 w-auto dark:block" />
            </div>
            <Sidebar defaultSelectedKey={defaultSelectedKey} items={sidebarSections} />
        </div>
    );

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-[#15151a] dark:via-[#17171d] dark:to-[#1a1a21]">
            <SidebarDrawer className="h-screen w-72 flex-shrink-0 border-r border-divider" isOpen={isOpen} onOpenChange={onOpenChange}>
                {sidebarContent}
            </SidebarDrawer>
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <DashboardNavbar />
                <div className={`flex flex-1 flex-col overflow-hidden ${fullBleed ? 'p-0' : 'p-4'}`}>
                    {!hideHeader && (
                        <header
                            className={`flex h-16 items-center gap-2 rounded-medium border-small border-divider bg-white/90 px-4 shadow-sm dark:bg-[#1f1f24]/90 ${
                                fullBleed ? 'm-4' : ''
                            }`}
                        >
                            <Button isIconOnly className="flex sm:hidden" size="sm" variant="light" onPress={onOpen}>
                                <Icon className="text-default-500" height={24} icon="solar:hamburger-menu-outline" width={24} />
                            </Button>
                            <h2 className="text-medium font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
                            {header ? <div className="ml-auto">{header}</div> : null}
                        </header>
                    )}
                    <main className={`${hideHeader ? '' : 'mt-4'} w-full flex-1 overflow-y-auto`}>{children}</main>
                </div>
            </div>
        </div>
    );
}

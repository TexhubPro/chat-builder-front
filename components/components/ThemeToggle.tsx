import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    React.useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <Button
            isIconOnly
            aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
            type="button"
            variant="bordered"
            size="sm"
            radius="full"
            onPress={() => setIsDark((value) => !value)}
            className="backdrop-blur"
        >
            <Icon icon={isDark ? 'solar:sun-2-outline' : 'solar:moon-outline'} width={18} />
        </Button>
    );
}

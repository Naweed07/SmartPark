'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <Button shape="circle" size="large" className="bg-white/30 backdrop-blur-md border-gray-300/50 shadow-sm opacity-0" />;
    }

    return (
        <Button
            shape="circle"
            size="large"
            className="bg-white/30 dark:bg-slate-800/50 backdrop-blur-md border-gray-300/50 dark:border-gray-600/50 text-[#0A1A3F] dark:text-gray-200 hover:text-[#1363DF] dark:hover:text-blue-400 shadow-sm flex items-center justify-center transition-all"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        />
    );
}

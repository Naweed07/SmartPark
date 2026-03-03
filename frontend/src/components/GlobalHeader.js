'use client';

import { useEffect, useState } from 'react';
import { Layout, Button, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, LogoutOutlined, LoginOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const { Header } = Layout;
const { Title } = Typography;

export default function GlobalHeader() {
    const [user, setUser] = useState(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    }, [pathname]); // Re-run when route changes

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
        router.push('/');
    };

    const handleDashboardClick = () => {
        if (user?.role === 'OWNER') {
            router.push('/owner/dashboard');
        } else {
            router.push('/driver/dashboard');
        }
    };

    // Don't show header on login/register pages to keep them clean
    if (pathname === '/login' || pathname === '/register') {
        return null;
    }

    // Owner dashboard has its own sidebar/header layout, let's not double-header it
    if (pathname.startsWith('/owner/dashboard')) {
        return null; // Owner dashboard manages its own internal header
    }

    const unmountedOrNoUserItems = [
        {
            key: 'login',
            icon: <LoginOutlined />,
            label: <Link href="/login">Login</Link>,
        },
        {
            key: 'register',
            icon: <UserOutlined />,
            label: <Link href="/register">Sign Up</Link>,
        },
    ];

    const userItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <span onClick={handleDashboardClick}>My Dashboard</span>,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span onClick={handleLogout} className="text-red-500">Logout</span>,
        },
    ];

    return (
        <Header
            className="px-4 md:px-8 absolute top-0 left-0 w-full z-50 h-24 pt-4 border-0 flex items-center justify-between"
            style={{ background: 'transparent' }}
        >
            {/* Left: Logo */}
            <div className="flex flex-1 items-center cursor-pointer" onClick={() => router.push('/')}>
                <img src="/logo.png" alt="SmartPark Logo" className="h-12 md:h-16 rounded-lg w-auto object-contain drop-shadow-sm" />
            </div>

            {/* Center: Navigation Links */}
            <div className="flex-1 hidden md:flex items-center justify-center gap-8">
                <Link href="/" className="relative group">
                    <Button type="text" className={`font-semibold text-base transition-colors hover:bg-transparent ${pathname === '/' ? 'text-[#1363DF] dark:text-[#3b82f6]' : 'text-[#0A1A3F] dark:text-white hover:text-[#1363DF] dark:hover:text-[#3b82f6]'}`}>
                        Home
                    </Button>
                    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 h-0.5 bg-[#0a1f44] dark:bg-white transition-all duration-300 ${pathname === '/' ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}></div>
                </Link>
                <Link href="/about" className="relative group">
                    <Button type="text" className={`font-semibold text-base transition-colors hover:bg-transparent ${pathname === '/about' ? 'text-[#1363DF] dark:text-[#3b82f6]' : 'text-[#0A1A3F] dark:text-white hover:text-[#1363DF] dark:hover:text-[#3b82f6]'}`}>
                        About Us
                    </Button>
                    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 h-0.5 bg-[#0a1f44] dark:bg-white transition-all duration-300 ${pathname === '/about' ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}></div>
                </Link>
                <Link href="/contact" className="relative group">
                    <Button type="text" className={`font-semibold text-base transition-colors hover:bg-transparent ${pathname === '/contact' ? 'text-[#1363DF] dark:text-[#3b82f6]' : 'text-[#0A1A3F] dark:text-white hover:text-[#1363DF] dark:hover:text-[#3b82f6]'}`}>
                        Contact Us
                    </Button>
                    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 h-0.5 bg-[#0a1f44] dark:bg-white transition-all duration-300 ${pathname === '/contact' ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}></div>
                </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-1 items-center justify-end gap-4">
                {pathname !== '/search' && (
                    <Link href="/search">
                        <Button type="primary" className="font-semibold hidden lg:flex items-center rounded-full px-6 h-10 shadow-md header-btn border-none">
                            Find Parking
                        </Button>
                    </Link>
                )}

                {!mounted ? null : user ? (
                    <Dropdown menu={{ items: userItems }} placement="bottomRight" trigger={['click']}>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/50 dark:hover:bg-slate-800/50 p-1.5 pr-4 rounded-full border border-gray-300/50 dark:border-slate-700/50 backdrop-blur-md transition-colors shadow-sm bg-white/30 dark:bg-slate-900/30">
                            <Avatar size="small" icon={<UserOutlined />} className="bg-[#1363DF]" />
                            <span className="text-sm font-bold text-[#0A1A3F] dark:text-slate-200 hidden sm:block">{user.name}</span>
                        </div>
                    </Dropdown>
                ) : (
                    <Dropdown menu={{ items: unmountedOrNoUserItems }} placement="bottomRight" trigger={['click']}>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/50 dark:hover:bg-slate-800/50 p-1.5 pr-4 rounded-full border border-gray-300/50 dark:border-slate-700/50 backdrop-blur-md transition-colors shadow-sm bg-white/30 dark:bg-slate-900/30">
                            <Avatar size="small" icon={<UserOutlined />} className="bg-gray-400 dark:bg-slate-600" />
                            <span className="text-sm font-bold text-[#0A1A3F] dark:text-slate-200 hidden sm:block">Menu</span>
                        </div>
                    </Dropdown>
                )}
                <ThemeToggle />
            </div>
        </Header>
    );
}

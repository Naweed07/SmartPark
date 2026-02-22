'use client';

import { useEffect, useState } from 'react';
import { Layout, Button, Dropdown, Avatar, Typography } from 'antd';
import { UserOutlined, DashboardOutlined, LogoutOutlined, LoginOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

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
        <Header className="custom-global-header px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 h-16">
            <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
                <Title level={3} className="text-brand-600 m-0 leading-none">Smart<span className="text-gray-900">Park</span></Title>
            </div>

            <div className="flex items-center gap-4">
                {pathname !== '/search' && (
                    <Link href="/search">
                        <Button type="text" className="font-medium hidden sm:flex items-center">
                            Find Parking
                        </Button>
                    </Link>
                )}

                {!mounted ? null : user ? (
                    <Dropdown menu={{ items: userItems }} placement="bottomRight" trigger={['click']}>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-full border border-gray-100 transition-colors">
                            <Avatar size="small" icon={<UserOutlined />} className="bg-brand-500" />
                            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                        </div>
                    </Dropdown>
                ) : (
                    <Dropdown menu={{ items: unmountedOrNoUserItems }} placement="bottomRight" trigger={['click']}>
                        <Button shape="circle" icon={<UserOutlined />} size="large" className="bg-gray-50 border-gray-200 text-gray-600 hover:text-brand-600 hover:border-brand-300" />
                    </Dropdown>
                )}
            </div>
        </Header>
    );
}

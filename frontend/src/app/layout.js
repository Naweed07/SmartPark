import './globals.css'
import './custom.css'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SmoothScroll from '../components/SmoothScroll';

export const metadata = {
    title: 'SmartPark | Find & Reserve Parking Space',
    description: 'Smart parking management for owners and drivers',
    formatDetection: {
        telephone: false,
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col font-sans">
                <SmoothScroll>
                    <AntdRegistry>
                        <ConfigProvider theme={{
                            token: {
                                colorPrimary: '#14b8a6', // matching tailwind brand-500
                                colorInfo: '#14b8a6',
                                colorLink: '#14b8a6',
                                colorLinkHover: '#0d9488',
                                borderRadius: 8,
                                fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
                            },
                            components: {
                                Menu: {
                                    itemSelectedBg: '#f0fdfa',
                                    itemSelectedColor: '#0f766e',
                                }
                            }
                        }}>
                            <GlobalHeader />
                            <main className="flex-grow">
                                {children}
                            </main>
                            <GlobalFooter />
                        </ConfigProvider>
                    </AntdRegistry>
                </SmoothScroll>
            </body>
        </html>
    )
}

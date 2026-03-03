import './globals.css'
import './custom.css'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SmoothScroll from '../components/SmoothScroll';
import { ThemeProvider } from '../components/ThemeProvider';

export const metadata = {
    title: 'SmartPark | Find & Reserve Parking Space',
    description: 'Smart parking management for owners and drivers',
    formatDetection: {
        telephone: false,
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen flex flex-col font-sans">
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    <SmoothScroll>
                        <AntdRegistry>
                            <ConfigProvider theme={{
                                token: {
                                    colorPrimary: '#0a1f44',
                                    colorInfo: '#0a1f44',
                                    colorLink: '#1363DF',
                                    colorLinkHover: '#0a1f44',
                                    borderRadius: 8,
                                    fontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
                                },
                                components: {
                                    Menu: {
                                        itemSelectedBg: '#f8fafc',
                                        itemSelectedColor: '#0a1f44',
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
                </ThemeProvider>
            </body>
        </html>
    )
}

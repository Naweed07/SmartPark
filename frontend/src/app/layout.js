import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';

export const metadata = {
    title: 'SmartPark | Find & Reserve Parking Space',
    description: 'Smart parking management for owners and drivers',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AntdRegistry>
                    <ConfigProvider theme={{
                        token: {
                            colorPrimary: '#14b8a6', // matching tailwind brand-500
                            colorInfo: '#14b8a6',
                            colorLink: '#14b8a6',
                            colorLinkHover: '#0d9488',
                            borderRadius: 8,
                            fontFamily: 'inherit',
                        },
                        components: {
                            Menu: {
                                itemSelectedBg: '#f0fdfa',
                                itemSelectedColor: '#0f766e',
                            }
                        }
                    }}>
                        {children}
                    </ConfigProvider>
                </AntdRegistry>
            </body>
        </html>
    )
}

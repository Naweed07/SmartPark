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
                            borderRadius: 8,
                            fontFamily: 'inherit',
                        }
                    }}>
                        {children}
                    </ConfigProvider>
                </AntdRegistry>
            </body>
        </html>
    )
}

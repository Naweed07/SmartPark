import { Button } from 'antd';
import Link from 'next/link';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-white">
            {/* Hero Section */}
            <div className="w-full max-w-6xl px-6 py-20 mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 transition-all duration-500 ease-in-out">
                    Find Parking, <span className="text-brand-500">Instantly</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 mb-10 max-w-3xl mx-auto">
                    SmartPark connects drivers with unused parking spaces. Reserve a spot in seconds, or list your own space and start earning.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
                    <Link href="/search">
                        <Button
                            type="primary"
                            size="large"
                            icon={<SearchOutlined />}
                            className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-brand-500/30 hover:-translate-y-1 transition-transform"
                        >
                            Find a Spot
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button
                            size="large"
                            icon={<EnvironmentOutlined />}
                            className="h-14 px-8 text-lg font-semibold rounded-full border-2 border-brand-500 text-brand-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                        >
                            List Your Space
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
    )
}

export const getApiUrl = () => {
    // Rely on Next.js API rewrites to securely proxy requests
    // This allows seamless mobile access via a single Ngrok HTTPS tunnel
    if (typeof window !== 'undefined') {
        return '/api';
    }
    // Fallback for SSR
    return 'http://localhost:5000/api';
};

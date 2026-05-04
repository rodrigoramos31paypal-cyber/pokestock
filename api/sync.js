const { Redis } = require('@upstash/redis');

module.exports = async function handler(request, response) {
    // Disable caching for cross-device sync
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    try {
        // This will now look for the exact key you see in your Vercel Dashboard
        const redisUrl = process.env.REDIS_URL;

        if (!redisUrl) {
            return response.status(500).json({ error: 'REDIS_URL is missing in Vercel settings.' });
        }

        // Standard Redis instances use a different connection method
        const redis = Redis.fromEnv();
        const DB_KEY = 'user_state_v1';

        if (request.method === 'GET') {
            const state = await redis.get(DB_KEY);
            return response.status(200).json(state || {});
        }

        if (request.method === 'POST') {
            const newState = request.body;
            await redis.set(DB_KEY, newState);
            return response.status(200).json({ status: 'success' });
        }

        return response.status(405).json({ error: 'Method not allowed' });
        
    } catch (error) {
        return response.status(500).json({ error: error.message });
    }
};
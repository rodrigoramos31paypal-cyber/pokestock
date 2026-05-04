const { Redis } = require('@upstash/redis');

module.exports = async function handler(request, response) {
    // 1. Tell Vercel and mobile browsers NEVER to cache this data
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.setHeader('Pragma', 'no-cache');
    response.setHeader('Expires', '0');

    try {
        // 2. Look for the correct database keys safely
        const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

        if (!url || !token) {
            return response.status(500).json({ error: 'Database keys are missing from Vercel.' });
        }

        const redis = new Redis({ url, token });
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
        console.error("API Error:", error);
        return response.status(500).json({ error: error.message });
    }
};
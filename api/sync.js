const { Redis } = require('@upstash/redis');

module.exports = async function handler(request, response) {
    try {
        // Initialize inside the handler to prevent Vercel build crashes!
        // This safely checks for both Vercel KV and Upstash variable formats
        const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || process.env.REDIS_URL;
        const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || process.env.REDIS_TOKEN;

        if (!redisUrl || !redisToken) {
            return response.status(500).json({ error: 'Database environment variables are missing in Vercel.' });
        }

        const redis = new Redis({
            url: redisUrl,
            token: redisToken,
        });

        const DB_KEY = 'user_state_v1';

        // Load the state
        if (request.method === 'GET') {
            const state = await redis.get(DB_KEY);
            return response.status(200).json(state || {});
        }

        // Save the state
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
const { Redis } = require('@upstash/redis');

// This version is specifically designed for the HTTPS REST URL
const redis = Redis.fromEnv();

module.exports = async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    try {
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
        console.error("Redis Error:", error);
        return response.status(500).json({ error: error.message });
    }
};
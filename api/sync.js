const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();

module.exports = async function handler(request, response) {
    const DB_KEY = 'user_state_v1';

    if (request.method === 'GET') {
        try {
            const state = await redis.get(DB_KEY);
            return response.status(200).json(state || {});
        } catch (error) {
            return response.status(500).json({ error: 'Failed to load state' });
        }
    }

    if (request.method === 'POST') {
        try {
            const newState = request.body;
            await redis.set(DB_KEY, newState);
            return response.status(200).json({ status: 'success' });
        } catch (error) {
            return response.status(500).json({ error: 'Failed to save state' });
        }
    }

    return response.status(405).json({ error: 'Method not allowed' });
};
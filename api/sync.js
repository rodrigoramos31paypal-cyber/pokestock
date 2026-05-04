import { Redis } from '@upstash/redis';

// Automatically connects using the environment variables Vercel injected!
const redis = Redis.fromEnv();

export default async function handler(request, response) {
    const DB_KEY = 'user_state_v1';

    // Handle GET request: Load the state
    if (request.method === 'GET') {
        try {
            const state = await redis.get(DB_KEY);
            return response.status(200).json(state || {});
        } catch (error) {
            return response.status(500).json({ error: 'Failed to load state' });
        }
    }

    // Handle POST request: Save the state
    if (request.method === 'POST') {
        try {
            const newState = request.body;
            await redis.set(DB_KEY, newState);
            return response.status(200).json({ status: 'success' });
        } catch (error) {
            return response.status(500).json({ error: 'Failed to save state' });
        }
    }

    // Handle unsupported methods
    return response.status(405).json({ error: 'Method not allowed' });
}
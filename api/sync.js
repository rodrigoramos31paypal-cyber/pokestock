const { createClient } = require('redis');

// Initialize the client using the environment variable
const client = createClient({
    url: process.env.REDIS_URL,
    // This ensures it retries the connection if it blips
    socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500)
    }
});

client.on('error', (err) => console.error('Redis Client Error:', err));

module.exports = async function handler(request, response) {
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    try {
        if (!client.isOpen) {
            await client.connect();
        }

        const DB_KEY = 'user_state_v1';

        if (request.method === 'GET') {
            const state = await client.get(DB_KEY);
            return response.status(200).json(JSON.parse(state) || {});
        }

        if (request.method === 'POST') {
            const newState = request.body;
            await client.set(DB_KEY, JSON.stringify(newState));
            return response.status(200).json({ status: 'success' });
        }

        return response.status(405).json({ error: 'Method not allowed' });
        
    } catch (error) {
        console.error("Database Sync Error:", error);
        return response.status(500).json({ error: error.message });
    }
};
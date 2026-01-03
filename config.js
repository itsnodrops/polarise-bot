/**
 * Polarise Bot Configuration
 * Edit these values to customize your bot
 * If values are invalid, defaults will be used
 */

export default {
    // Groq Configuration
    GROQ: {
        // Available models: 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'
        MODEL: 'llama-3.3-70b-versatile',

        // Generate content on startup
        GENERATE_ON_STARTUP: true,
        POSTS_PER_GENERATE: 25,
        DISCUSSIONS_PER_GENERATE: 25,
    },

    // Change Profile username true/false
    CHANGE_USERNAME: false,

    // Daily Limits (per account per day)
    DAILY_LIMITS: {
        MAX_POSTS_PER_DAY: 50,
        MAX_DISCUSSIONS_PER_DAY: 10,
        MAX_TIPS_PER_DAY: 10,
        MAX_COMMENTS_PER_DAY: 100,
        MAX_SUBSCRIBES_PER_DAY: 10,
    },

    // Delays and Timing (in milliseconds)
    DELAYS: {
        BETWEEN_ACCOUNTS_MS: 10000,
    }
};

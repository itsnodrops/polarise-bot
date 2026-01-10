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

    // Update profile (username and avatar) if still default. Set to false to skip
    UPDATE_PROFILE: true,

    // Daily Limits (per account per day)
    DAILY_LIMITS: {
        MAX_FAUCET_CLAIMS_PER_DAY: 1,
        MAX_POSTS_PER_DAY: 10,
        MAX_DISCUSSIONS_PER_DAY: 10,
        MAX_TIPS_PER_DAY: 10,
        MAX_COMMENTS_PER_DAY: 50,
        MAX_SUBSCRIBES_PER_DAY: 10,
    },

    // Delays and Timing (in milliseconds)
    DELAYS: {
        BETWEEN_ACCOUNTS_MS: 10000,
    },

    // Loop Configuration
    // ENABLE_LOOP: true = script goes idle after processing, then re-runs
    // LOOP_TIME: HH:MM:SS format, countdown until next run (e.g., '10:30:00' = 10.5 hours)
    ENABLE_LOOP: false,     // Set to true to enable loop
    LOOP_TIME: '12:00:00',  // 12 hours, ignored if ENABLE_LOOP is false
};

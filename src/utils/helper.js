import { randomBytes, createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.txt');

// Username Generation

const ADJECTIVES = [
    // Existing adjectives + short names
    'Cool ', 'Super ', 'Hyper ', 'Mega ', 'Ultra ', 'Cyber ', 'Neon ', 'Tech ', 'Crypto ', 'Meta ', 'Smart ', 'Clean ',
    'Fast ', 'Swift ', 'Bright ', 'Bold ', 'Epic ', 'Prime ', 'Elite ', 'Pro ', 'Quantum ', 'Atomic ', 'Digital ',
    'Virtual ', 'Infinite ', 'Stellar ', 'Mystic ', 'Phantom ', 'Rogue ', 'Lucky ', 'Turbo ', 'Apex ', 'Ghost ',
    'Liquid ', 'Shadow ', 'Token ', 'Block ', 'Chain ', 'Mint ',
    'Jane ', 'John ', 'Dennis ', 'Max ', 'Leo ', 'Kai ', 'Mia ', 'Ava ', 'Sam ', 'Alex ', 'Zoe ', 'Eli ', 'Ben ', 'Liv ', 'Ray ', 'Tom ', 'Lux ', 'Rex ', 'Neo ',

    // NEW crypto / blockchain / GameFi / DeFi / SocialFi inspired adjectives
    'Hash', 'Byte', 'DeFi', 'GameFi', 'SocialFi', 'NFT', 'DAO',
    'Satoshi', 'HODL', 'Moon', 'Lunar', 'Orbit', 'Rocket', 'Atomic', 'Genesis', 'Protocol', 'Node', 'Chainlink',
    'Pixel', 'Blocky', 'Tokenized', 'Digital', 'Minted', 'Fantom', 'Airdrop', 'Liquidity', 'Swap', 'Rugged',
    'Sharded', 'Layer2', 'Metaverse', 'Virtual', 'Cybernetic', 'Epicenter', 'Hyperlink', 'Quantum', 'Neural',
    'CryptoKidd', 'Pixelated', 'Blockchain', 'Staked', 'Unlocked', 'Infinite', 'Dynamic', 'Boosted', 'Legendary'
];

const NOUNS = [
    // Existing nouns
    'Trader', 'HODLer', 'Builder', 'Dev', 'Ninja', 'Guru', 'Whale', 'Shark', 'Bull', 'Bear', 'Falcon', 'Eagle', 'Wolf', 'Lion', 'Tiger', 'Star', 'Moon', 'Sun', 'Orbit', 'Node',
    'Miner', 'Ledger', 'Stake', 'Vault', 'LP', 'Swap', 'Degen', 'Ape', 'Pixel', 'Gamer', 'Boss', 'Guild', 'DAO', 'Rocket', 'Coin', 'Hero',

    // NEW crypto / blockchain / GameFi / DeFi / SocialFi nouns
    'HODLer', 'Fork', 'Airdrop', 'Mint', 'Burn', 'ETH', 'SOL', 'BTC',
    'Layer', 'Sharder', 'Validator', 'Stakeholder', 'Governance', 'Rug', 'Gem', 'Pixel', 'Avatar', 'Metaverse', 'Quest', 'Boss', 'Arena',
    'Champion', 'Legend', 'Epic', 'Rare', 'Mystic', 'Orb', 'Crystal', 'Gemstone', 'Satoshi', 'NodeRunner', 'Bit', 'Hash', 'Cipher', 'LedgerMaster',
    'VaultKeeper', 'Coiner', 'RocketShip', 'Moonlander', 'Staker', 'MinerBot', 'Chainlinker', 'HODLster', 'DegenLord', 'SwapMaster',
    'NFTHunter', 'PixelWarrior', 'GameLord', 'DAOster', 'LiquidityHero', 'TokenMage', 'BlockWizard', 'CryptoKnight', 'ApeLord', 'ChainRider'
];

/**
 * Get a random profile from profiles.txt
 * Format: username,description (one per line)
 * @returns {{username: string, description: string}|null} Profile or null if file empty/missing
 */
export function getRandomProfile() {
    try {
        if (!fs.existsSync(PROFILES_FILE)) return null;

        const content = fs.readFileSync(PROFILES_FILE, 'utf-8');
        const lines = content.split('\n')
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('#')); // Skip empty lines and comments

        if (lines.length === 0) return null;

        const randomLine = lines[Math.floor(Math.random() * lines.length)];
        const [username, ...descParts] = randomLine.split(',');
        const description = descParts.join(',').trim(); // Rejoin in case description has commas

        if (!username) return null;

        return {
            username: username.trim(),
            description: description || "I'm grinding points on Polarise, the best SocialFi platform out there. Come join me before it blows up."
        };
    } catch (error) {
        return null;
    }
}

/**
 * Generate a random username (fallback if profiles.txt is empty)
 */
export function generateUsername() {
    const adj = getRandomItem(ADJECTIVES);
    const noun = getRandomItem(NOUNS);
    const num = Math.floor(Math.random() * 1000);
    return `${adj}${noun}${num}`;
}

// ============================================
// General Utilities
// ============================================

/**
 * Generate random UUID v4
 */
export function generateUUID() {
    const bytes = randomBytes(16);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Generate SHA256 hash of input
 */
export function sha256(input) {
    return createHash('sha256').update(input).digest('hex');
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get random item from array
 */
export function getRandomItem(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str, length = 20) {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
}

/**
 * Format wallet address for display
 */
export function formatAddress(address) {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Retry function with exponential backoff
 */
export async function retry(fn, options = {}) {
    const { maxRetries = 3, delay = 1000, backoff = 2 } = options;

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                const waitTime = delay * Math.pow(backoff, i);
                await sleep(waitTime);
            }
        }
    }
    throw lastError;
}

/**
 * Parse proxy string into components
 */
export function parseProxy(proxyString) {
    if (!proxyString) return null;

    try {
        const url = new URL(proxyString);
        return {
            protocol: url.protocol.replace(':', ''),
            host: url.hostname,
            port: parseInt(url.port),
            username: url.username || null,
            password: url.password || null
        };
    } catch (e) {
        return null;
    }
}

// ============================================
// Error Handling & RPC Utilities
// ============================================

/**
 * Check if error is retryable (RPC/Network issues)
 */
export function isRetryableError(error) {
    if (!error) return false;
    const msg = (error.message || error.toString()).toLowerCase();

    return msg.includes('server_error') ||
        msg.includes('500') ||
        msg.includes('502') ||
        msg.includes('503') ||
        msg.includes('504') ||
        msg.includes('etimedout') ||
        msg.includes('econnreset') ||
        msg.includes('econnrefused') ||
        msg.includes('ehostunreach') ||
        msg.includes('timeout') ||
        msg.includes('rpc error') ||
        msg.includes('bad response') ||
        msg.includes('network') ||
        msg.includes('connect') ||
        msg.includes('socket') ||
        msg.includes('tunnel') ||
        msg.includes('proxy') ||
        msg.includes('missing response') ||
        msg.includes('underpriced') ||
        msg.includes('rate limit');
}

/**
 * Centralized error handler
 * @param {Error} error - The error object
 * @param {string} context - Context string (e.g. "Swap")
 * @param {object} log - Logger instance
 * @returns {boolean} - True if handled/retryable, False if critical
 */
export function handleError(error, context, log) {
    const msg = (error.message || error.toString()).replace(/\n/g, ' ').slice(0, 100);

    if (isRetryableError(error)) {
        if (log && log.warn) {
            log.warn(`${context} Error: ${msg}... (Will retry if applicable)`);
        }
        // Suppressed console.warn fallback to fix TUI noise
        return true;
    }

    if (log && log.fail) {
        log.fail(`${context} Failed: ${msg}`);
    }
    // Suppressed console.error fallback to fix TUI noise
    return false;
}

/**
 * Retry operation with centralized error handling
 * @param {Function} fn - Async function to retry
 * @param {string} context - Context name for logging
 * @param {object} log - Logger instance (optional)
 * @param {number} maxRetries - Max retry attempts
 * @param {number} baseDelay - Initial delay in ms
 */
export async function retryOperation(fn, context = 'Operation', log = null, maxRetries = 3, baseDelay = 3500) {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            // Check if last attempt or not retryable
            if (i === maxRetries || !isRetryableError(error)) {
                // If log provided, let caller handle final error or log it here?
                // Usually caller handles final failure. We just rethrow.
                // But we can log "Run out of retries" if we want.
                throw error;
            }

            // Log retry
            const msg = (error.message || '').replace(/\n/g, ' ').slice(0, 60);
            if (log && log.warn) {
                log.warn(`${context} RPC/Net Error (${i}/${maxRetries}): ${msg}... Retrying...`);
            } else {
                // Use a cleaner console log or suppress if no logger
                // Suppressing generic console.log to fix TUI noise
                // console.log(`[${context}] Retry ${i}/${maxRetries}: ${msg}...`); 
            }

            await sleep(baseDelay * Math.pow(2, i - 1));
        }
    }
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitive(str, visibleChars = 4) {
    if (!str || str.length <= visibleChars * 2) return '***';
    return `${str.slice(0, visibleChars)}...${str.slice(-visibleChars)}`;
}

// ============================================
// Data Storage
// ============================================

/**
 * Ensure data directory exists
 */
function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

/**
 * Load all accounts from data.json
 */
export function loadAccounts() {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
        return {};
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

/**
 * Save all accounts to data.json
 */
export function saveAccounts(accounts) {
    ensureDataDir();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(accounts, null, 2));
    } catch (error) {
        // Suppressed console.error to fix TUI noise
    }
}

/**
 * Get account data by wallet address
 */
export function getAccount(wallet) {
    const accounts = loadAccounts();
    return accounts[wallet.toLowerCase()] || null;
}

/**
 * Save/update account data
 */
export function saveAccount(accountData) {
    const accounts = loadAccounts();
    const key = accountData.wallet.toLowerCase();

    accounts[key] = {
        ...accounts[key],
        ...accountData,
        updatedAt: new Date().toISOString()
    };

    saveAccounts(accounts);
    return accounts[key];
}

/**
 * Check if account is already registered
 */
export function isRegistered(wallet) {
    const account = getAccount(wallet);
    return account?.registered === true;
}

/**
 * Update session tokens for an account
 */
export function updateTokens(wallet, tokens) {
    const accounts = loadAccounts();
    const key = wallet.toLowerCase();

    if (accounts[key]) {
        accounts[key].accessToken = tokens.accessToken;
        accounts[key].authToken = tokens.authToken;
        accounts[key].tokenUpdatedAt = new Date().toISOString();
        saveAccounts(accounts);
    }
}

// ============================================
// Daily Tracking Helpers
// ============================================

/**
 * Get today's date string (YYYY-MM-DD)
 */
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

/**
 * Get daily stats for an account
 */
export function getDailyStats(wallet) {
    const account = getAccount(wallet);
    if (!account) return null;

    const today = getTodayDate();
    const stats = account.dailyStats || {};

    // Return fresh stats if no data for today
    if (stats.date !== today) {
        return {
            date: today,
            postsToday: 0,
            discussionsToday: 0,
            faucetClaimsToday: 0,
            griseSwappedToday: 0,
            tipsToday: 0,
            commentsToday: 0,
            subscribesToday: 0
        };
    }

    return stats;
}

/**
 * Update daily stats for an account
 */
export function updateDailyStats(wallet, updates) {
    const accounts = loadAccounts();
    const key = wallet.toLowerCase();

    if (!accounts[key]) return;

    const today = getTodayDate();
    const currentStats = accounts[key].dailyStats || {};

    // Reset if new day
    if (currentStats.date !== today) {
        accounts[key].dailyStats = {
            date: today,
            postsToday: 0,
            discussionsToday: 0,
            faucetClaimsToday: 0,
            griseSwappedToday: 0,
            tipsToday: 0,
            commentsToday: 0,
            subscribesToday: 0
        };
    }

    // Apply updates
    Object.assign(accounts[key].dailyStats, updates);
    saveAccounts(accounts);
}

/**
 * Increment post count for today
 */
export function incrementPostsToday(wallet) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        postsToday: (stats?.postsToday || 0) + 1
    });
}

/**
 * Increment discussion count for today
 */
export function incrementDiscussionsToday(wallet) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        discussionsToday: (stats?.discussionsToday || 0) + 1
    });
}

/**
 * Increment tips count for today
 */
export function incrementTipsToday(wallet) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        tipsToday: (stats?.tipsToday || 0) + 1
    });
}

/**
 * Increment faucet claim count for today
 */
export function incrementFaucetClaimsToday(wallet) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        faucetClaimsToday: (stats?.faucetClaimsToday || 0) + 1
    });
}

/**
 * Increment comment count for today
 */
export function incrementCommentsToday(wallet) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        commentsToday: (stats?.commentsToday || 0) + 1
    });
}

/**
 * Increment subscribe count for today
 */
export function incrementSubscribesToday(wallet) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        subscribesToday: (stats?.subscribesToday || 0) + 1
    });
}

/**
 * Check if can tip today (under limit)
 */
export function canTipToday(wallet, limit = 5) {
    const stats = getDailyStats(wallet);
    return (stats?.tipsToday || 0) < limit;
}

/**
 * Check if can post today (under limit)
 */
export function canPostToday(wallet, maxPosts = 10) {
    const stats = getDailyStats(wallet);
    return (stats?.postsToday || 0) < maxPosts;
}

/**
 * Check if can create discussion today (under limit)
 */
export function canDiscussionToday(wallet, maxDiscussions = 10) {
    const stats = getDailyStats(wallet);
    return (stats?.discussionsToday || 0) < maxDiscussions;
}

/**
 * Check if can claim faucet today (under limit)
 */
export function canClaimFaucetToday(wallet, maxClaims = 2) {
    const stats = getDailyStats(wallet);
    return (stats?.faucetClaimsToday || 0) < maxClaims;
}

/**
 * Get GRISE swapped today
 */
export function getGriseSwappedToday(wallet) {
    const stats = getDailyStats(wallet);
    return stats?.griseSwappedToday || 0;
}

/**
 * Increment GRISE swapped today
 */
export function incrementGriseSwappedToday(wallet, amount) {
    const stats = getDailyStats(wallet);
    updateDailyStats(wallet, {
        date: getTodayDate(),
        griseSwappedToday: (stats?.griseSwappedToday || 0) + amount
    });
}

/**
 * Set GRISE swapped limit (e.g. 100)
 */
export function setGriseSwappedLimit(wallet, amount = 100) {
    updateDailyStats(wallet, {
        date: getTodayDate(),
        griseSwappedToday: amount
    });
}

// ============================================
// Proxy Utilities
// ============================================

import { gotScraping } from 'got-scraping';

/**
 * Normalize proxy URL to include protocol
 */
export function normalizeProxy(proxy) {
    const schemes = ['http://', 'https://', 'socks4://', 'socks5://'];
    return schemes.some(s => proxy.startsWith(s)) ? proxy : `http://${proxy}`;
}

/**
 * Check if a proxy is working using got-scraping
 * @returns {Promise<{success: boolean, latency?: number, ip?: string, error?: string}>}
 */
export async function checkProxy(proxyUrl) {
    const startTime = Date.now();
    try {
        const response = await gotScraping.get('https://api.ipify.org?format=json', {
            proxyUrl: proxyUrl,
            timeout: { request: 30000 },
            responseType: 'json',
            retry: { limit: 0 }
        });

        const latency = Date.now() - startTime;
        return { success: true, latency, ip: response.body.ip };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// ProxyPool - Concurrent Proxy Management
// ============================================

/**
 * ProxyPool - Manages proxy allocation
 * Handles blocking logic (max 10 fails blocks proxy)
 */
export class ProxyPool {
    /**
     * @param {string[]} proxies - Array of validated proxy URLs
     */
    constructor(proxies) {
        this.proxies = proxies.map((url) => ({
            url: normalizeProxy(url),
            busy: false,
            usageCount: 0,
            blockCount: 0,
            blocked: false,
        }));
        this.waitQueue = [];
        this.noProxyMode = proxies.length === 0;
        this.MAX_BLOCK_COUNT = 10;

        // Semaphore for no-proxy mode (enforces sequential processing)
        this.noProxyBusy = false;
        this.noProxyWaitQueue = [];
    }

    /**
     * Acquire an idle, non-blocked proxy. If none available, waits until one is released.
     * In no-proxy mode, enforces sequential processing (1 account at a time).
     * @returns {Promise<string|null>} Proxy URL or null if no proxies configured
     */
    async acquire() {
        // No proxy mode - enforce sequential processing with semaphore
        if (this.noProxyMode) {
            if (!this.noProxyBusy) {
                this.noProxyBusy = true;
                return null;
            }
            // Wait for current account to finish
            return new Promise((resolve) => {
                this.noProxyWaitQueue.push(() => {
                    this.noProxyBusy = true;
                    resolve(null);
                });
            });
        }

        // Find an idle, non-blocked proxy
        const idle = this.proxies.find((p) => !p.busy && !p.blocked);
        if (idle) {
            idle.busy = true;
            idle.usageCount++;
            return idle.url;
        }

        // Check if all proxies are blocked
        const allBlocked = this.proxies.every((p) => p.blocked);
        if (allBlocked) {
            throw new Error('All proxies are blocked');
        }

        // No idle proxy - wait for one to be released
        return new Promise((resolve) => {
            this.waitQueue.push(resolve);
        });
    }

    /**
     * Release a proxy back to the pool
     * @param {string|null} proxyUrl - Proxy URL to release (null in no-proxy mode)
     */
    release(proxyUrl) {
        // No-proxy mode - release semaphore and process wait queue
        if (this.noProxyMode) {
            if (this.noProxyWaitQueue.length > 0) {
                const nextCallback = this.noProxyWaitQueue.shift();
                nextCallback();
            } else {
                this.noProxyBusy = false;
            }
            return;
        }

        if (proxyUrl === null) {
            return;
        }

        const proxy = this.proxies.find((p) => p.url === proxyUrl);
        if (!proxy) {
            return;
        }

        // If someone is waiting for a non-blocked proxy, give them this one
        if (!proxy.blocked && this.waitQueue.length > 0) {
            const nextResolve = this.waitQueue.shift();
            proxy.usageCount++;
            nextResolve(proxy.url);
        } else {
            proxy.busy = false;
        }
    }

    /**
     * Mark a proxy as blocked
     * @param {string|null} proxyUrl - Proxy URL that was blocked
     * @returns {boolean} True if proxy is now permanently blocked
     */
    markBlocked(proxyUrl) {
        if (this.noProxyMode || proxyUrl === null) return false;

        const proxy = this.proxies.find((p) => p.url === proxyUrl);
        if (!proxy) return false;

        proxy.blockCount++;
        if (proxy.blockCount >= this.MAX_BLOCK_COUNT) {
            proxy.blocked = true;
            proxy.busy = false;
            return true;
        }
        return false;
    }

    /**
     * Mark a proxy as successful (resets block counter)
     * @param {string|null} proxyUrl - Proxy URL that succeeded
     */
    markSuccess(proxyUrl) {
        if (this.noProxyMode || proxyUrl === null) return;

        const proxy = this.proxies.find((p) => p.url === proxyUrl);
        if (proxy && !proxy.blocked) {
            proxy.blockCount = 0;
        }
    }

    /**
     * Get concurrency level (number of non-blocked proxies, or 1 if no proxies)
     * @returns {number}
     */
    getConcurrency() {
        if (this.noProxyMode) return 1;
        const available = this.proxies.filter((p) => !p.blocked).length;
        return available > 0 ? available : 1;
    }

    /**
     * Get pool statistics
     */
    getStats() {
        if (this.noProxyMode) {
            return { total: 0, active: 0, idle: 0, blocked: 0, waiting: 0 };
        }

        const active = this.proxies.filter((p) => p.busy && !p.blocked).length;
        const blocked = this.proxies.filter((p) => p.blocked).length;
        return {
            total: this.proxies.length,
            active,
            idle: this.proxies.length - active - blocked,
            blocked,
            waiting: this.waitQueue.length,
        };
    }
}

// ============================================
// SolverKeyPool - SOLVER_API_KEY_N Rotation
// ============================================

/**
 * SolverKeyPool - Manages SCTG API key allocation for concurrent requests
 * 
 * Round-robin distribution across concurrent accounts
 */
export class SolverKeyPool {
    /**
     * @param {string[]} keys - Array of SCTG API keys
     */
    constructor(keys) {
        this.keys = keys.map((key) => ({
            key,
            busy: false,
            usageCount: 0,
        }));
        this.waitQueue = [];
        this.noKeyMode = keys.length === 0;

        // Semaphore for no-key mode
        this.noKeyBusy = false;
        this.noKeyWaitQueue = [];
    }

    /**
     * Acquire an idle key. If none available, waits until one is released.
     * @returns {Promise<string|null>} API key or null if no keys configured
     */
    async acquire() {
        if (this.noKeyMode) {
            if (!this.noKeyBusy) {
                this.noKeyBusy = true;
                return null;
            }
            return new Promise((resolve) => {
                this.noKeyWaitQueue.push(() => {
                    this.noKeyBusy = true;
                    resolve(null);
                });
            });
        }

        // Find an idle key
        const idle = this.keys.find((k) => !k.busy);
        if (idle) {
            idle.busy = true;
            idle.usageCount++;
            return idle.key;
        }

        // No idle key - wait for one to be released
        return new Promise((resolve) => {
            this.waitQueue.push(resolve);
        });
    }

    /**
     * Release a key back to the pool
     * @param {string|null} apiKey - API key to release
     */
    release(apiKey) {
        if (this.noKeyMode) {
            if (this.noKeyWaitQueue.length > 0) {
                const nextCallback = this.noKeyWaitQueue.shift();
                nextCallback();
            } else {
                this.noKeyBusy = false;
            }
            return;
        }

        if (apiKey === null) return;

        const key = this.keys.find((k) => k.key === apiKey);
        if (!key) return;

        if (this.waitQueue.length > 0) {
            const nextResolve = this.waitQueue.shift();
            key.usageCount++;
            nextResolve(key.key);
        } else {
            key.busy = false;
        }
    }

    /**
     * Get number of available keys
     * @returns {number}
     */
    getCount() {
        return this.keys.length;
    }
}

// ============================================
// Content Pool (data/contents.json)
// ============================================

const CONTENTS_FILE = path.join(DATA_DIR, 'contents.json');

/**
 * Initialize contents.json if it doesn't exist
 */
function initContentsFile() {
    ensureDataDir();
    if (!fs.existsSync(CONTENTS_FILE)) {
        fs.writeFileSync(CONTENTS_FILE, JSON.stringify({
            posts: [],
            discussions: []
        }, null, 2));
    }
}

/**
 * Save a content ID to the pool
 * @param {'posts'|'discussions'} type 
 * @param {string} id 
 * @param {object} extraData Optional extra context (title, url, etc)
 */
export function saveContentId(type, id, extraData = {}) {
    try {
        initContentsFile();

        const data = JSON.parse(fs.readFileSync(CONTENTS_FILE, 'utf-8'));

        if (!data[type]) {
            data[type] = [];
        }

        // Avoid duplicates
        const existing = data[type].find(item => item.id === id);
        if (existing) return;

        data[type].push({
            id,
            timestamp: Date.now(),
            ...extraData
        });

        // Keep only last 1000 items to prevent infinite growth
        if (data[type].length > 1000) {
            data[type] = data[type].slice(-1000);
        }

        fs.writeFileSync(CONTENTS_FILE, JSON.stringify(data, null, 2));

    } catch (error) {
        // Suppressed console.error to fix TUI noise
    }
}

/**
 * Get a random content ID from the pool
 * @param {'posts'|'discussions'} type 
 * @returns {string|null} ID or null if empty
 */
export function getRandomContentId(type) {
    try {
        if (!fs.existsSync(CONTENTS_FILE)) return null;

        const data = JSON.parse(fs.readFileSync(CONTENTS_FILE, 'utf-8'));
        const items = data[type];

        if (!items || items.length === 0) return null;

        const randomItem = items[Math.floor(Math.random() * items.length)];
        return randomItem.id;

    } catch (error) {
        // Suppressed console.error to fix TUI noise
        return null;
    }
}

/**
 * Get random content object from the pool
 * @param {'posts'|'discussions'} type 
 * @returns {object|null} Content object or null
 */
export function getRandomContent(type) {
    try {
        if (!fs.existsSync(CONTENTS_FILE)) return null;

        const data = JSON.parse(fs.readFileSync(CONTENTS_FILE, 'utf-8'));
        const items = data[type];

        if (!items || items.length === 0) return null;

        return items[Math.floor(Math.random() * items.length)];

    } catch (error) {
        // Suppressed console.error to fix TUI noise
        return null;
    }
}

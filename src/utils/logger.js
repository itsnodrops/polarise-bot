import { appendFileSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log directory and file paths
const LOG_DIR = join(__dirname, '../../logs');
const LOG_FILE = join(LOG_DIR, 'process.log');

// Ensure log directory exists
if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
}

// Reset log file on startup
writeFileSync(LOG_FILE, `=== Polarise Bot - Started at ${new Date().toISOString()} ===\n\n`);

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m'
};

/**
 * Format timestamp for logs
 */
function getTimestamp() {
    return new Date().toISOString();
}

/**
 * Write to log file
 */
function writeToFile(level, prefix, message, data = null) {
    const timestamp = getTimestamp();
    let logLine = `[${timestamp}] [${level.toUpperCase()}] ${prefix ? `[${prefix}] ` : ''}${message}`;

    if (data !== null) {
        if (typeof data === 'object') {
            logLine += '\n' + JSON.stringify(data, null, 2);
        } else {
            logLine += ` ${data}`;
        }
    }

    logLine += '\n';

    try {
        appendFileSync(LOG_FILE, logLine);
    } catch (error) {
        console.error('Failed to write to log file:', error.message);
    }
}

/**
 * Create logger instance with optional prefix
 */
export function createLogger(prefix = '') {
    return {
        // INFO - white (default console color)
        info(message, data = null) {
            const timestamp = getTimestamp();
            const prefixStr = prefix ? `[${prefix}] ` : '';
            console.log(`${colors.gray}[${timestamp}]${colors.reset} [INFO] ${prefixStr}${message}`);
            writeToFile('INFO', prefix, message, data);
        },

        // WARN - yellow/orange
        warn(message, data = null) {
            const timestamp = getTimestamp();
            const prefixStr = prefix ? `[${prefix}] ` : '';
            console.log(`${colors.gray}[${timestamp}]${colors.reset} ${colors.yellow}[WARN]${colors.reset} ${prefixStr}${colors.yellow}${message}${colors.reset}`);
            writeToFile('WARN', prefix, message, data);
        },

        // DONE - green (success)
        done(message, data = null) {
            const timestamp = getTimestamp();
            const prefixStr = prefix ? `[${prefix}] ` : '';
            console.log(`${colors.gray}[${timestamp}]${colors.reset} ${colors.green}[DONE]${colors.reset} ${prefixStr}${colors.green}${message}${colors.reset}`);
            writeToFile('DONE', prefix, message, data);
        },

        // FAIL - red (error)
        fail(message, data = null) {
            const timestamp = getTimestamp();
            const prefixStr = prefix ? `[${prefix}] ` : '';
            console.log(`${colors.gray}[${timestamp}]${colors.reset} ${colors.red}[FAIL]${colors.reset} ${prefixStr}${colors.red}${message}${colors.reset}`);
            writeToFile('FAIL', prefix, message, data);
        },

        // Aliases for backward compatibility
        success: function (message, data = null) { this.done(message, data); },
        error: function (message, data = null) { this.fail(message, data); },
        debug: function (message, data = null) { this.info(message, data); },
        request: function (method, url) { this.info(`${method} ${url}`); },
        response: function (status, url) { this.info(`${status} ${url}`); }
    };
}

// Default logger instance
export const logger = createLogger();

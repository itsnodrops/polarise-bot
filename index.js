/**
 * Polarise Bot - CLI Entry Point
 * Usage: node index.js [command]
 * 
 * Commands:
 *   (default)       Run the bot
 *   --clear-log     Clear the log file
 *   --check-log     Watch log file in real-time
 *   --check-config  Check configuration
 *   --check-data    Show accounts data table
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHS = {
    log: path.join(__dirname, 'logs', 'process.log'),
    data: path.join(__dirname, 'data', 'data.json'),
    env: path.join(__dirname, '.env'),
    proxies: path.join(__dirname, 'proxies.txt'),
    posts: path.join(__dirname, 'data', 'posts.txt'),
    discussions: path.join(__dirname, 'data', 'discussions.txt')
};

async function clearLog() {
    if (fs.existsSync(PATHS.log)) {
        fs.writeFileSync(PATHS.log, '');
        console.log('✓ Log file cleared');
    } else {
        console.log('Log file does not exist');
    }
}

async function clearData() {
    if (fs.existsSync(PATHS.data)) {
        fs.writeFileSync(PATHS.data, '{}');
        console.log('✓ Data file cleared (reset to empty object)');
    } else {
        console.log('Data file does not exist');
    }
}

async function watchLog() {
    if (!fs.existsSync(PATHS.log)) {
        console.log('Log file does not exist');
        return;
    }

    console.log('Watching log file... (Ctrl+C to stop)\n');

    let lastSize = 0;
    const interval = setInterval(() => {
        try {
            const stats = fs.statSync(PATHS.log);
            if (stats.size > lastSize) {
                const fd = fs.openSync(PATHS.log, 'r');
                const buffer = Buffer.alloc(stats.size - lastSize);
                fs.readSync(fd, buffer, 0, buffer.length, lastSize);
                fs.closeSync(fd);
                process.stdout.write(buffer.toString());
                lastSize = stats.size;
            }
        } catch (e) {
            // File may be temporarily unavailable
        }
    }, 500);

    process.on('SIGINT', () => {
        clearInterval(interval);
        console.log('\nStopped watching.');
        process.exit(0);
    });
}

async function checkConfig() {
    console.log('\n📋 Configuration Check\n');

    // Check .env - auto-generate if missing
    if (fs.existsSync(PATHS.env)) {
        const envContent = fs.readFileSync(PATHS.env, 'utf-8');
        const pkCount = (envContent.match(/^PK_\d+=/gm) || []).length;
        const hasGroq = envContent.includes('GROQ_API_KEY=gsk_');
        const hasSolver = envContent.match(/SOLVER_API_KEY(_\d+)?=\w+/);
        console.log(`✓ .env found with ${pkCount} private key(s)`);
        console.log(`  - Groq API: ${hasGroq ? 'configured' : 'not configured (optional)'}`);
        console.log(`  - Solver API: ${hasSolver ? 'configured' : 'not configured (optional)'}`);
    } else {
        // Auto-generate .env template
        const envTemplate = `# ===========================================
# Polarise Bot - Environment Configuration
# ===========================================

# ===========================================
# Groq API (Optional - for AI content generation)
# ===========================================
# Get your key from: https://console.groq.com
# Without this, bot uses content from data/posts.txt and data/discussions.txt
GROQ_API_KEY=

# ===========================================
# Solver API (Optional - for faucet captcha solving)
# ===========================================
# Get your key from: https://t.me/Xevil_check_bot
# Without this, faucet claiming will be skipped
SOLVER_API_KEY=

# Private keys (add as many as needed)
# Format: PK_N where N is a sequential number starting from 1
PK_1=your_private_key_here
# PK_2=your_second_private_key_here
`;
        fs.writeFileSync(PATHS.env, envTemplate);
        console.log('✓ .env created with template (please configure your private keys)');
    }

    // Check proxies
    if (fs.existsSync(PATHS.proxies)) {
        const proxyContent = fs.readFileSync(PATHS.proxies, 'utf-8');
        const proxyCount = proxyContent.split('\n').filter(l => l.trim() && !l.startsWith('#')).length;
        console.log(`✓ proxies.txt found with ${proxyCount} proxy(ies)`);
    } else {
        console.log('✗ proxies.txt not found');
    }

    // Check data
    if (fs.existsSync(PATHS.data)) {
        try {
            const data = JSON.parse(fs.readFileSync(PATHS.data, 'utf-8'));
            const count = Object.keys(data).length;
            console.log(`✓ data.json found with ${count} account(s)`);
        } catch {
            console.log('✗ data.json is corrupted');
        }
    } else {
        console.log('○ data.json not found (will be created on first run)');
    }

    // Check content files
    const postsCount = fs.existsSync(PATHS.posts)
        ? fs.readFileSync(PATHS.posts, 'utf-8').split('\n').filter(l => l.trim()).length
        : 0;
    const discussionsCount = fs.existsSync(PATHS.discussions)
        ? fs.readFileSync(PATHS.discussions, 'utf-8').split('\n').filter(l => l.trim()).length
        : 0;
    console.log(`○ Content: ${postsCount} posts, ${discussionsCount} discussions available`);

    console.log('');
}

async function showAccounts() {
    console.log('\n📊 Account Data Summary\n');

    if (!fs.existsSync(PATHS.data)) {
        console.log('✗ data.json not found');
        return;
    }

    try {
        const data = JSON.parse(fs.readFileSync(PATHS.data, 'utf-8'));
        const accounts = Object.values(data);

        if (accounts.length === 0) {
            console.log('No accounts found in data.json');
            return;
        }

        // Prepare table data with custom index
        const tableData = accounts.map((acc, idx) => {
            const dailyStats = acc.dailyStats || {};

            return {
                '#': idx + 1,
                Wallet: acc.wallet ? `${acc.wallet.slice(0, 6)}...${acc.wallet.slice(-4)}` : 'N/A',
                Username: acc.userName || 'N/A',
                Points: acc.points || 0,
                POLAR: acc.latestPolarBalance ? parseFloat(acc.latestPolarBalance).toFixed(2) : '0.00',
                GRISE: acc.latestGriseBalance ? parseFloat(acc.latestGriseBalance).toFixed(2) : '0.00',
                Post: dailyStats.postsToday || 0,
                Discuss: dailyStats.discussionsToday || 0,
                Tip: dailyStats.tipsToday || 0,
                Comment: dailyStats.commentsToday || 0,
                Subscribe: dailyStats.subscribesToday || 0
            };
        });

        // Custom table formatter
        const headers = ['#', 'Wallet', 'Username', 'Points', 'POLAR', 'GRISE', 'Post', 'Discuss', 'Tip', 'Comment', 'Subscribe'];
        const colWidths = {
            '#': 4,
            'Wallet': 15,
            'Username': 10,
            'Points': 8,
            'POLAR': 8,
            'GRISE': 10,
            'Post': 6,
            'Discuss': 8,
            'Tip': 5,
            'Comment': 8,
            'Subscribe': 10
        };

        // Print header
        const headerLine = headers.map(h => h.padEnd(colWidths[h])).join(' │ ');
        const separator = headers.map(h => '─'.repeat(colWidths[h])).join('─┼─');

        console.log('┌─' + separator + '─┐');
        console.log('│ ' + headerLine + ' │');
        console.log('├─' + separator + '─┤');

        // Print rows
        tableData.forEach(row => {
            const rowLine = headers.map(h => String(row[h]).padEnd(colWidths[h])).join(' │ ');
            console.log('│ ' + rowLine + ' │');
        });

        console.log('└─' + separator + '─┘');
        console.log(`\nTotal accounts: ${accounts.length}\n`);

    } catch (error) {
        console.log('✗ Error reading data.json:', error.message);
    }
}

async function runBot() {
    const { run } = await import('./src/app.js');
    await run();
}

// Parse CLI arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case '--clear-log':
        await clearLog();
        break;
    case '--clear-data':
        await clearData();
        break;
    case '--check-log':
        await watchLog();
        break;
    case '--check-config':
        await checkConfig();
        break;
    case '--check-data':
    case '--show-data':
        await showAccounts();
        break;
    default:
        // Suppress specific ethers.js errors that spam TUI
        const originalError = console.error;
        const originalLog = console.log;

        console.error = function (...args) {
            const msg = args.join(' ');
            if (msg.includes('JsonRpcProvider failed to detect network')) return;
            originalError.apply(console, args);
        };

        console.log = function (...args) {
            const msg = args.join(' ');
            if (msg.includes('JsonRpcProvider failed to detect network')) return;
            originalLog.apply(console, args);
        };

        runBot().catch(console.error);
}

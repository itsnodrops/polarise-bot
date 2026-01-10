# Polarise Bot

Automated bot for interacting with Polarise with support for multi-account, proxy rotation, and automated content generation.

> ⚠️**WARNING**⚠️ \
> **Code Obfuscation Notice**: This script will be obfuscated to prevent unauthorized code redistribution. The full source code will be shared publicly after the event ends.

> 💡 **Auto-Register Feature**: This bot supports automatic account registration with referral codes. For access to this feature, check our Telegram channel: [@NoDrops](https://t.me/NoDrops)

## ✨ Features

- 🔐 **Wallet Authentication** - Connect wallet and manage sessions automatically
- 🤖 **Auto Content Generation** - Generate posts and discussions using Groq AI (Llama/Mixtral)
- 💧 **Auto Faucet** - Automatically claim faucet tokens with captcha solving
- 🧩 **Captcha Solving** - Integrated Turnstile/reCAPTCHA solving via Solver API
- ✅ **Daily Tasks** - Complete posts, discussions, tips, comments, and subscribes
- 💱 **Point Swapping** - Automatically swap earned points for GRISE tokens
- 👥 **Multi-Account** - Process multiple accounts concurrently
- 🔄 **Proxy Support** - HTTP, HTTPS, SOCKS4, and SOCKS5 proxies with rotation
- 📊 **TUI Dashboard** - Real-time monitoring of account progress, points, and proxy status
- 👤 **Auto Profile Update** - Automatically update default usernames and avatars
- 🔄 **Token Auto-Refresh** - Seamlessly refreshes expired tokens without restarting tasks
- 💾 **Task State Persistence** - Resumes from exact point after auth errors

## ⚙️ How It Works

1. **Initialization** - Bot loads private keys from `.env`, assigns proxies from `proxies.txt`
2. **Authentication** - Signs wallet message with private key, obtains auth token
3. **Faucet Claim** - Claims daily faucet tokens (requires Solver API)
4. **Profile Check** - Updates profile if username (`0x...`) or avatar is still default
5. **Daily Tasks** - Completes tasks in sequence:
   - 📝 Posts (text/media) → uses content from `posts.txt`
   - 💬 Discussions → uses topics from `discussions.txt`
   - 💡 Tips → tips other users with GRISE tokens
   - 💬 Comments → comments on posts in content pool
   - 👥 Subscribes → follows other accounts
6. **Point Swapping** - Swaps accumulated points for GRISE tokens
7. **Loop** - Repeats for all accounts with delays between runs

## 📋 Requirements

- **[Polarise Protocol](https://app.polarise.org/?code=iZAtsX)** accounts
- **Node.js** v18 or higher
- **npm** (Node Package Manager)
- **Private Keys** - Ethereum wallet private keys
- **[Groq API Key](https://console.groq.com/keys)** - Optional, for AI content generation. Without it, bot uses built-in content.
- **[Solver API Key](https://t.me/Xevil_check_bot?start=1379619439)** - Optional, for faucet captcha solving
- **Proxies** (Optional but recommended for multiple accounts)

## 🚀 Quick Start

### 1. Clone or Download the Repository

```bash
git clone https://github.com/itsnodrops/polarise-bot.git
cd polarise-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file with your keys (see `.env.example`):

```env
# Solver API Keys
SOLVER_API_KEY=your_solver_api_key

# Groq API (for content generation)
GROQ_API_KEY=your_groq_api_key

# Private Keys (numbered format)
PK_1=0x...your_private_key_1
PK_2=0x...your_private_key_2
```

### 4. Add Proxies (Optional)

Edit `proxies.txt` to add your proxies (one per line):

```
http://user:pass@proxy1.com:8080
socks5://user:pass@proxy2.com:1080
```

### 5. Configure Custom Profiles (Optional)

Create `data/profiles.txt` for custom usernames and descriptions:

```
# Format: username,description (one per line)
# Comments start with #
CryptoKing,Building the future of DeFi one block at a time 🚀
MoonHunter,HODL believer | NFT collector | Web3 enthusiast 💎
```

If `profiles.txt` is empty or missing, the bot will generate random usernames.

### 6. Run the Bot

```bash
npm start
```

## ⚙️ Configuration

Edit `config.js` to customize bot behavior:

| Setting | Description |
|---------|-------------|
| `UPDATE_PROFILE` | true/false automatic profile updates (username + avatar) |
| `GROQ.MODEL` | Choose between Llama and Mixtral models for content generation |
| `DAILY_LIMITS` | Configure max posts, comments, tips, discussions per day |
| `DELAYS` | Adjust timing between accounts to mimic human behavior |
| `ENABLE_LOOP` | true/false - If true, script goes idle after processing then re-runs |
| `LOOP_TIME` | HH:MM:SS format countdown until next run (e.g., `12:00:00` = 12 hours) |

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **Faucet limit reached** | Daily faucet limit (2) already claimed. Will retry tomorrow. |
| **Swap failed** | Point swapping failed. Ensure you have enough points (min 100). |
| **Network/Proxy error** | Proxy or network is unstable. Bot will retry 3 times then pause or skip. |
| **Solver error** | Check your `SOLVER_API_KEY`. |
| **Groq/Content error** | Check `GROQ_API_KEY` or quota. Bot can run without Groq but features will be limited. |
| **Login failed** | Check private key format or proxy. Token auto-refreshes on expiry. |
| **Profile not updating** | Check `UPDATE_PROFILE` in config.js and ensure `profiles.txt` exists. |

## 🧰 Utility Scripts

```bash
npm start              # Run the bot
npm run clear-log      # Clear log file
npm run clear-data     # Clear token cache
npm run check-config   # Check config status (auto-creates .env if missing)
npm run check-log      # Check log file in real-time
npm run check-data     # Check accounts data table
```

## 📁 Data Files (User Configurable)

All files in the `data/` folder can be customized by the user:

| File | Format | Editable |
|------|--------|----------|
| `profiles.txt` | `username,description` | ✅ Add your own profiles |
| `posts.txt` | `title,content` | ✅ Add custom posts |
| `discussions.txt` | `title\|option1\|option2\|emoji` | ✅ Add custom topics |
| `data.json` | JSON (auto-managed) | ⚠️ Auto-managed |
| `contents.json` | JSON (auto-managed) | ⚠️ Auto-managed |

**Tip:** Without Groq API, the bot uses content from `posts.txt` and `discussions.txt`. You can populate these files manually with your own content!

## � Project Structure

```
polarise-bot/
├── index.js              # CLI entry point
├── config.js             # Bot configuration
├── package.json          # Dependencies
├── proxies.txt           # Proxy list
├── .env                  # Environment variables
│
├── src/
│   ├── app.js            # Main bot logic
│   ├── ui.js             # TUI dashboard
│   │
│   ├── core/
│   │   ├── api.js        # Polarise API client
│   │   └── network.js    # RPC/blockchain interactions
│   │
│   ├── services/
│   │   ├── tasks.js      # Task execution (posts, tips, etc.)
│   │   ├── faucet.js     # Faucet claiming with captcha
│   │   ├── groq.js       # AI content generation
│   │   └── register.js   # Account registration or login handler
│   │
│   └── utils/
│       ├── helper.js     # Utilities, data management
│       └── logger.js     # Logging functions
│
├── data/                 # Account data, content pools
└── logs/                 # Runtime logs
```

## 🛡️ Disclaimer

This tool is for educational and testing purposes only. Use at your own risk. The authors are not responsible for any consequences resulting from the use of this software.

## 📄 License

This project is licensed under the [MIT © 2026](LICENSE).

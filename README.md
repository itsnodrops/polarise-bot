# Polarise Bot

Automated bot for interacting with Polarise with support for multi-account, proxy rotation, and automated content generation.

> ⚠️**WARNING**⚠️ \
> **Code Obfuscation Notice**: This script will be obfuscated to prevent unauthorized code redistribution. The full source code will be shared publicly after the event ends.

> 💡 **Auto-Register Feature**: This bot supports automatic account registration with referral codes. For access to this feature, check our Telegram channel: [@NoDrops](https://t.me/NoDrops)

## ✨ Features

- 🔐 **Wallet Authentication** - Connect wallet and manage sessions automatically
- 📸 **Rich Media Posts** - Auto-post text content with supported media attachments
- ⚡ **Smart Proxy Pool** - Intelligent concurrency that maps accounts to proxies 1:1 (e.g., runs 5 accounts simultaneously with 5 unique proxies)
- 🤖 **Auto Content Generation** - Generate posts and discussions using Groq AI (Llama/Mixtral)
- 💧 **Auto Faucet** - Automatically claim faucet tokens with captcha solving
- ✅ **Comprehensive Daily Tasks**:
  - **Posts & Discussions**: Create engaging content
  - **Likes**: Auto-like community posts
  - **Follows**: Build social graph (distinct from subscribing)
  - **Subscribes**: Subscribe to creators/channels
  - **Tips**: Distribute GRISE token tips
  - **Comments**: Reply to community threads
- 💱 **Point Swapping** - Automatically swap earned points for GRISE tokens
- 📊 **TUI Dashboard** - Real-time monitoring of concurrent threads, points, and proxy status
- 🧩 **Captcha Solving** - Integrated reCaptcha v2 solving via Solver API
- 👤 **Auto Profile Update** - Automatically change default usernames (0x...) to custom profiles

## ⚙️ How It Works

1. **Initialization** - Bot loads private keys from `.env`, assigns proxies from `proxies.txt`
2. **Authentication** - Signs wallet message with private key, obtains auth token
3. **Profile Check** - Fetches profile, updates username if still default (`0x...`)
4. **Daily Tasks** - Completes tasks in sequence for each active thread:
   - 📝 **Create Posts** (Text/Media) → uses content/images from data sources
   - 💬 **Create Discussions** → uses topics from `discussions.txt`
   - ❤️ **Like Posts** → interacts with trending or recent feed items
   - 👣 **Follow Users** → follows target accounts or suggested users
   - 🔔 **Subscribe** → subscribes to specific channels/creators
   - 💡 **Send Tips** → tips other users with GRISE tokens
   - 🗣️ **Comments** → comments on posts in content pool
5. **Point Swapping** - Swaps accumulated points for GRISE tokens
6. **Faucet Claim** - Claims daily faucet tokens (requires Solver API)
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
| `CHANGE_USERNAME` | Enable/disable automatic username changes for default `0x...` names |
| `GROQ_MODEL` | Choose between Llama and Mixtral models for content generation |
| `DAILY_LIMITS` | Configure max posts, comments, tips, faucet claims per day |
| `DELAYS` | Adjust timing between accounts to mimic human behavior |

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **Faucet limit reached** | Daily faucet limit (2) already claimed. Will retry tomorrow. |
| **Swap failed** | Point swapping failed. Ensure you have enough points (min 100). |
| **Network/Proxy error** | Proxy or network is unstable. Bot will retry 3 times then pause or skip. |
| **Solver error** | Check your `SOLVER_API_KEY`. |
| **Groq/Content error** | Check `GROQ_API_KEY` or quota. Bot can run without Groq but features will be limited. |
| **Login failed** | Check private key format or proxy. Token may be expired (auto-refreshes). |
| **Username not changing** | Check `CHANGE_USERNAME` in config.js and ensure `profiles.txt` exists. |

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

## 📑 Project Structure

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

This project is licensed under the [MIT © 2025](LICENSE).


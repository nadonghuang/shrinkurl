<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Zero_Deps-✅-success?style=for-the-badge" alt="Zero Deps"/>
  <img src="https://img.shields.io/badge/Tool-CLI-informational?style=for-the-badge" alt="CLI Tool"/>
</p>

<h1 align="center">🔗 shrinkurl</h1>

<p align="center">
  <strong>Zero-dependency URL shortener CLI tool with custom domains, analytics, and no external dependencies</strong>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Install</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-examples">Examples</a> •
  <a href="#-api">API</a> •
  <a href="#-license">License</a>
</p>

---

<p align="center">
  <strong>Create short URLs, track clicks, and manage your links with a simple CLI tool</strong>
</p>

---

## ✨ Features

- 🔗 **URL Shortening** — Create short URLs instantly with customizable domains
- 📊 **Analytics** — Track clicks, referrers, and daily statistics
- 🏷️ **Custom Aliases** — Use meaningful short codes instead of random ones
- 🌐 **Multiple Domains** — Support for multiple custom domains
- 📈 **Real-time Stats** — View click counts and traffic patterns
- 💾 **Persistent Storage** — All data stored locally in JSON format
- 🔒 **Privacy-Focused** — No external services, your data stays on your machine
- ⚡ **Zero Dependencies** — Built with native Node.js modules only
- 🎯 **CLI Interface** — Full command-line interface with intuitive commands

## 📦 Installation

```bash
# Install globally
npm install -g shrinkurl

# Or use npx (no installation needed)
npx shrinkurl --help
```

## 🚀 Usage

### Basic Usage

```bash
# Shorten a URL
shrinkurl shorten https://github.com/nadonghuang

# With custom alias
shrinkurl shorten https://github.com/nadonghuang --alias github

# With custom domain
shrinkurl shorten https://github.com/nadonghuang --domain my.link

# With title
shrinkurl shorten https://github.com/nadonghuang --title "My GitHub Profile"

# Show stats after shortening
shrinkurl shorten https://github.com/nadonghuang --stats
```

### Advanced Commands

```bash
# Expand a short URL to see the original
shrinkurl expand https://shrnk.link/abc123

# View analytics for a short URL
shrinkurl stats https://shrnk.link/abc123

# List all shortened URLs
shrinkurl list

# List URLs for specific domain
shrinkurl list --domain my.link

# Export stats as JSON
shrinkurl stats https://shrnk.link/abc123 --json
```

## 📖 Examples

### Quick Start

```bash
# Create your first short URL
shrinkurl shorten "https://developer.mozilla.org/en-US/docs/Web/JavaScript" --title "MDN JavaScript"

# Result:
# ✅ URL Shortened Successfully!
# 🔗 Short URL: https://shrnk.link/js-docs
# 📊 Original URL: https://developer.mozilla.org/en-US/docs/Web/JavaScript
# 📝 Created: 2026-04-09T02:00:00.000Z

# View analytics
shrinkurl stats https://shrnk.link/js-docs

# Result:
# 📈 Analytics for: https://shrnk.link/js-docs
# 👥 Total clicks: 0
# 🕒 Last click: No clicks yet
```

### Working with Multiple Domains

```bash
# Shorten with different domains
shrinkurl shorten "https://nodejs.org" --domain node.link --alias nodejs-docs
shrinkurl shorten "https://www.python.org" --domain python.link --alias python-home

# List URLs by domain
shrinkurl list --domain node.link
shrinkurl list --domain python.link
```

### Bulk Operations

```bash
# Shorten multiple URLs in sequence
shrinkurl shorten "https://github.com/topics/cli" --title "CLI Topics"
shrinkurl shorten "https://github.com/topics/javascript" --title "JavaScript Topics" 
shrinkurl shorten "https://github.com/topics/python" --title "Python Topics"

# List all your shortened URLs
shrinkurl list --limit 10
```

## 🛠️ Commands

### `shrinkurl shorten <url>`
Create a short URL from a long URL.

**Options:**
- `-d, --domain <domain>` — Custom domain (default: `shrnk.link`)
- `-a, --alias <alias>` — Custom short code
- `-t, --title <title>` — Title for the URL
- `-s, --stats` — Show analytics after shortening

### `shrinkurl expand <shortUrl>`
Expand a shortened URL to reveal the original.

### `shrinkurl stats <shortUrl>`
Show analytics and click statistics for a shortened URL.

**Options:**
- `-j, --json` — Output in JSON format

### `shrinkurl list`
List all shortened URLs.

**Options:**
- `-d, --domain <domain>` — Filter by domain
- `-l, --limit <number>` — Limit results (default: 10)
- `-j, --json` — Output in JSON format

## 📁 Project Structure

```
shrinkurl/
├── bin/
│   └── shrinkurl.js        # CLI entry point
├── lib/
│   ├── index.js            # Module exports
│   ├── shortener.js        # Core shortening logic
│   └── analytics.js        # Analytics and statistics
├── examples/
│   ├── basic.js            # Basic usage example
│   └── advanced.js         # Advanced features example
├── README.md
├── package.json
└── .gitignore
```

## 🧠 How It Works

### Storage
All URLs and analytics data are stored locally in `.shrinkurl/urls.json` as a JSON file. Each entry contains:

- `id` — Unique identifier
- `code` — Short code (random or custom)
- `originalUrl` — The original long URL
- `shortUrl` — The shortened URL
- `domain` — Domain used for shortening
- `title` — Optional title/description
- `createdAt` — Creation timestamp
- `clicks` — Total click count
- `clicksByDay` — Daily click breakdown
- `referrers` — Referrer tracking

### ID Generation
Short codes are generated using a 6-character alphanumeric string by default. If you specify a custom alias, that will be used instead. The system ensures all codes are unique.

### Analytics
Click tracking records:
- Total click count
- Clicks by date (for daily trends)
- Referrer URLs (for traffic sources)

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/nadonghuang/shrinkurl.git
cd shrinkurl

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run examples
node examples/basic.js
node examples/advanced.js
```

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/nadonghuang">nadonghuang</a>
  <br/>
  <sub>If you find this useful, please give it a ⭐!</sub>
</p>
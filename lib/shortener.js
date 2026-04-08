const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class Shortener {
  constructor() {
    this.dataDir = path.join(process.cwd(), '.shrinkurl');
    this.urlsFile = path.join(this.dataDir, 'urls.json');
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  generateId(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async shorten(url, options = {}) {
    // Validate URL
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    // Check if URL already shortened
    const existing = await this.findByOriginalUrl(url);
    if (existing) {
      return existing;
    }

    // Generate short code
    let code = options.alias;
    if (!code) {
      code = this.generateId();
      
      // Ensure code is unique
      let attempts = 0;
      while (await this.findByCode(code)) {
        code = this.generateId();
        attempts++;
        if (attempts > 10) {
          code = this.generateId(8); // Use longer code if collision
        }
      }
    }

    // Create short URL
    const domain = options.domain || 'shrnk.link';
    const shortUrl = `https://${domain}/${code}`;

    // Create URL entry
    const entry = {
      id: crypto.randomUUID(),
      code,
      originalUrl: url,
      shortUrl,
      domain,
      title: options.title || '',
      createdAt: new Date().toISOString(),
      clicks: 0,
      clicksByDay: {},
      referrers: {}
    };

    // Save to storage
    await this.saveUrl(entry);

    return entry;
  }

  async expand(shortUrl) {
    const code = this.extractCode(shortUrl);
    const entry = await this.findByCode(code);
    
    if (!entry) {
      throw new Error('Shortened URL not found');
    }

    return entry;
  }

  async findByCode(code) {
    const urls = await this.getAllUrls();
    return urls.find(url => url.code === code);
  }

  async findByOriginalUrl(url) {
    const urls = await this.getAllUrls();
    return urls.find(url => url.originalUrl === url);
  }

  async findByDomain(domain) {
    const urls = await this.getAllUrls();
    return urls.filter(url => url.domain === domain);
  }

  async getAllUrls() {
    try {
      const data = await fs.readFile(this.urlsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async saveUrl(entry) {
    const urls = await this.getAllUrls();
    
    // Remove duplicate if any
    const filtered = urls.filter(url => url.code !== entry.code);
    filtered.push(entry);
    
    await fs.writeFile(this.urlsFile, JSON.stringify(filtered, null, 2));
  }

  async recordClick(shortUrl, referrer = '') {
    const code = this.extractCode(shortUrl);
    const entry = await this.findByCode(code);
    
    if (!entry) {
      throw new Error('Shortened URL not found');
    }

    entry.clicks++;
    
    // Record by day
    const today = new Date().toISOString().split('T')[0];
    entry.clicksByDay[today] = (entry.clicksByDay[today] || 0) + 1;
    
    // Record referrer
    if (referrer) {
      entry.referrers[referrer] = (entry.referrers[referrer] || 0) + 1;
    }
    
    await this.saveUrl(entry);
  }

  async delete(code) {
    const urls = await this.getAllUrls();
    const filtered = urls.filter(url => url.code !== code);
    
    await fs.writeFile(this.urlsFile, JSON.stringify(filtered, null, 2));
  }

  async list(options = {}) {
    let urls = await this.getAllUrls();
    
    if (options.domain) {
      urls = urls.filter(url => url.domain === options.domain);
    }
    
    if (options.limit) {
      urls = urls.slice(0, options.limit);
    }
    
    return urls;
  }

  extractCode(shortUrl) {
    try {
      const url = new URL(shortUrl);
      const pathParts = url.pathname.split('/').filter(part => part);
      return pathParts[pathParts.length - 1];
    } catch (error) {
      throw new Error('Invalid shortened URL format');
    }
  }

  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getStats(shortUrl) {
    const code = this.extractCode(shortUrl);
    const entry = await this.findByCode(code);
    
    if (!entry) {
      throw new Error('Shortened URL not found');
    }

    return {
      clicks: entry.clicks,
      lastClick: Object.entries(entry.clicksByDay)
        .sort(([a], [b]) => b.localeCompare(a))[0]?.[0] || null,
      topReferrer: Object.entries(entry.referrers)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || null,
      clicksByDay: entry.clicksByDay
    };
  }
}

module.exports = Shortener;
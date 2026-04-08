const Shortener = require('./shortener');

class Analytics {
  constructor() {
    this.shortener = new Shortener();
  }

  async getStats(shortUrl) {
    return await this.shortener.getStats(shortUrl);
  }

  async getDomainStats(domain) {
    const urls = await this.shortener.findByDomain(domain);
    
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const totalUrls = urls.length;
    const avgClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(2) : 0;
    
    // Find top URLs by clicks
    const topUrls = urls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map(url => ({
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        originalUrl: url.originalUrl
      }));
    
    // Get recent activity (last 7 days)
    const recentActivity = this.getRecentActivity(urls);
    
    return {
      domain,
      totalUrls,
      totalClicks,
      avgClicks,
      topUrls,
      recentActivity
    };
  }

  async getOverallStats() {
    const urls = await this.shortener.getAllUrls();
    
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const totalUrls = urls.length;
    const avgClicks = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(2) : 0;
    
    // Find most active domains
    const domainStats = {};
    urls.forEach(url => {
      domainStats[url.domain] = (domainStats[url.domain] || 0) + 1;
    });
    
    const topDomains = Object.entries(domainStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([domain, count]) => ({ domain, count }));
    
    // Get URLs with most clicks
    const topUrls = urls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map(url => ({
        shortUrl: url.shortUrl,
        clicks: url.clicks,
        domain: url.domain,
        originalUrl: url.originalUrl
      }));
    
    return {
      totalUrls,
      totalClicks,
      avgClicks,
      topDomains,
      topUrls
    };
  }

  getRecentActivity(urls) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recent = urls.filter(url => {
      const created = new Date(url.createdAt);
      return created >= sevenDaysAgo;
    });
    
    return recent.length;
  }

  exportData() {
    return this.shortener.getAllUrls();
  }

  importData(data) {
    // This would be implemented to import data from external sources
    // For now, just return the data
    return data;
  }
}

module.exports = Analytics;
const Shortener = require('../lib/shortener');

async function advancedExample() {
  console.log('🔧 Advanced Shortener Example');
  console.log('============================');
  
  const shortener = new Shortener();
  
  try {
    // Multiple URLs with different options
    const urls = [
      {
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        title: 'MDN JavaScript Docs',
        domain: 'js.link'
      },
      {
        url: 'https://nodejs.org/en/docs/guides/',
        title: 'Node.js Guides',
        domain: 'node.link'
      },
      {
        url: 'https://github.com/topics/cli',
        title: 'CLI Tools on GitHub',
        alias: 'cli-tools'
      }
    ];
    
    console.log('📝 Creating multiple URLs:');
    const results = [];
    
    for (const config of urls) {
      const result = await shortener.shorten(config.url, {
        title: config.title,
        domain: config.domain,
        alias: config.alias
      });
      results.push(result);
      
      console.log(`   ✅ ${config.title}`);
      console.log(`      ${result.shortUrl}`);
    }
    
    // List all URLs
    console.log('\n📋 All URLs:');
    const allUrls = await shortener.list();
    allUrls.forEach(url => {
      console.log(`   🔗 ${url.shortUrl} → ${url.originalUrl}`);
      console.log(`      Clicks: ${url.clicks}, Domain: ${url.domain}`);
    });
    
    // Domain-specific stats
    console.log('\n🌐 Domain Statistics:');
    const domains = [...new Set(allUrls.map(url => url.domain))];
    
    for (const domain of domains) {
      const domainUrls = await shortener.findByDomain(domain);
      const totalClicks = domainUrls.reduce((sum, url) => sum + url.clicks, 0);
      
      console.log(`   ${domain}: ${domainUrls.length} URLs, ${totalClicks} total clicks`);
    }
    
    // Simulate some clicks
    console.log('\n🖱️  Simulating clicks...');
    for (let i = 0; i < 5; i++) {
      const randomUrl = results[Math.floor(Math.random() * results.length)];
      await shortener.recordClick(randomUrl.shortUrl, `https://referrer${i}.com`);
      console.log(`   Clicked: ${randomUrl.shortUrl}`);
    }
    
    // Show updated stats
    console.log('\n📈 Updated Statistics:');
    results.forEach(result => {
      const stats = await shortener.getStats(result.shortUrl);
      console.log(`   ${result.shortUrl}: ${stats.clicks} clicks`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example
advancedExample().catch(console.error);
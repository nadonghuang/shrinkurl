const Shortener = require('../lib/shortener');

async function basicExample() {
  console.log('🚀 Basic Shortener Example');
  console.log('===========================');
  
  const shortener = new Shortener();
  
  try {
    // Shorten a URL
    const result = await shortener.shorten('https://github.com/nadonghuang', {
      title: 'GitHub Profile'
    });
    
    console.log('✅ URL Shortened:');
    console.log(`   Short URL: ${result.shortUrl}`);
    console.log(`   Original:  ${result.originalUrl}`);
    console.log(`   Created:   ${result.createdAt}`);
    
    // Expand the short URL
    const expanded = await shortener.expand(result.shortUrl);
    console.log('\n🔄 URL Expanded:');
    console.log(`   Short URL: ${expanded.shortUrl}`);
    console.log(`   Original:  ${expanded.originalUrl}`);
    
    // Get stats
    const stats = await shortener.getStats(result.shortUrl);
    console.log('\n📊 Stats:');
    console.log(`   Clicks: ${stats.clicks}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the example
basicExample().catch(console.error);
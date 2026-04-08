#!/usr/bin/env node

const { program, Option } = require('commander');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

const Shortener = require('../lib/shortener');
const Analytics = require('../lib/analytics');

program
  .name('shrinkurl')
  .description('🔗 Zero-dependency URL shortener CLI tool with custom domains and analytics')
  .version('1.0.0');

// Shorten command
program
  .command('shorten')
  .description('Shorten a URL')
  .argument('<url>', 'URL to shorten')
  .addOption(new Option('-d, --domain <domain>', 'Custom domain').default('shrnk.link'))
  .addOption(new Option('-a, --alias <alias>', 'Custom alias for the short URL'))
  .addOption(new Option('-t, --title <title>', 'Title for the URL'))
  .addOption(new Option('-s, --stats', 'Show analytics after shortening'))
  .action(async (url, options) => {
    try {
      const shortener = new Shortener();
      const result = await shortener.shorten(url, {
        domain: options.domain,
        alias: options.alias,
        title: options.title
      });
      
      console.log(chalk.green('✅ URL Shortened Successfully!'));
      console.log(chalk.cyan(`🔗 Short URL: ${result.shortUrl}`));
      console.log(chalk.yellow(`📊 Original URL: ${result.originalUrl}`));
      console.log(chalk.gray(`📝 Created: ${result.createdAt}`));
      
      if (options.stats) {
        console.log('\n' + chalk.blue('📈 Analytics:'));
        const analytics = new Analytics();
        const stats = await analytics.getStats(result.shortUrl);
        console.log(chalk.cyan(`👥 Clicks: ${stats.clicks}`));
        console.log(chalk.cyan(`🕒 Last click: ${stats.lastClick || 'No clicks yet'}`));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Expand command
program
  .command('expand')
  .description('Expand a shortened URL')
  .argument('<shortUrl>', 'Shortened URL to expand')
  .action(async (shortUrl) => {
    try {
      const shortener = new Shortener();
      const result = await shortener.expand(shortUrl);
      
      console.log(chalk.green('✅ URL Expanded Successfully!'));
      console.log(chalk.yellow('🔗 Original URL:', result.originalUrl));
      console.log(chalk.gray(`📝 Created: ${result.createdAt}`));
      
      // Show basic stats
      const analytics = new Analytics();
      const stats = await analytics.getStats(shortUrl);
      console.log(chalk.blue('📊 Clicks:', stats.clicks));
      
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Stats command
program
  .command('stats')
  .description('Show analytics for a shortened URL')
  .argument('<shortUrl>', 'Shortened URL to get stats for')
  .addOption(new Option('-j, --json', 'Output in JSON format'))
  .action(async (shortUrl, options) => {
    try {
      const analytics = new Analytics();
      const stats = await analytics.getStats(shortUrl);
      
      if (options.json) {
        console.log(JSON.stringify(stats, null, 2));
      } else {
        console.log(chalk.blue('📈 Analytics for:', shortUrl));
        console.log(chalk.cyan(`👥 Total clicks: ${stats.clicks}`));
        
        if (stats.clicks > 0) {
          console.log(chalk.cyan(`🕒 Last click: ${stats.lastClick}`));
          console.log(chalk.cyan(`🌍 Top referrer: ${stats.topReferrer || 'Unknown'}`));
        }
        
        if (stats.clicksByDay) {
          console.log(chalk.yellow('\n📊 Clicks by day:'));
          Object.entries(stats.clicksByDay).forEach(([day, count]) => {
            console.log(chalk.gray(`  ${day}: ${count} clicks`));
          });
        }
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// List command
program
  .command('list')
  .description('List all shortened URLs')
  .addOption(new Option('-d, --domain <domain>', 'Filter by domain'))
  .addOption(new Option('-l, --limit <number>', 'Limit results').default('10'))
  .addOption(new Option('-j, --json', 'Output in JSON format'))
  .action(async (options) => {
    try {
      const shortener = new Shortener();
      const urls = await shortener.list({
        domain: options.domain,
        limit: parseInt(options.limit)
      });
      
      if (options.json) {
        console.log(JSON.stringify(urls, null, 2));
      } else {
        console.log(chalk.blue('📝 Shortened URLs:'));
        urls.forEach(url => {
          console.log(chalk.cyan(`${url.shortUrl} → ${url.originalUrl}`));
          console.log(chalk.gray(`  Created: ${url.createdAt}, Clicks: ${url.clicks}`));
          console.log('');
        });
      }
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

// Dev mode for testing
if (process.argv.includes('--dev')) {
  program.parse(['node', 'shrinkurl', ...process.argv.filter(arg => arg !== '--dev')]);
} else {
  program.parse();
}
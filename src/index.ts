import { program } from 'commander';
import { crawlPost } from './crawl';
import { login } from './login';
import { getMyPostUrls } from './post';
import fs from 'fs';
import path from 'path';

async function main() {
  program
    .command('archive')
    .description('Archive CLIEN posts')
    .option('--url <url>', 'URL of the post to archive')
    .option('--urls <path>', 'Path to the CSV file containing URLs')
    .option('--userId <userId>', 'User ID for login')
    .option('--userPassword <userPassword>', 'User password for login')
    .action(async options => {
      const { url, urls, userId, userPassword } = options;

      if (userId && userPassword) {
        const clienCookie = await login(userId, userPassword);
        const articleList = await getMyPostUrls(
          Array.from(clienCookie.keys())
            .map(key => `${key}=${clienCookie.get(key)}`)
            .join('; '),
          'articles',
          'title',
        );

        for (const article of articleList) {
          console.log(`Archiving URL: ${article.url}`);
          await crawlPost(article.url);
          // wait for 1 second
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (url) {
        const sanitizedUrl = url.split('?')[0];
        console.log(`Archiving URL: ${sanitizedUrl}`);
        await crawlPost(sanitizedUrl);
      } else if (urls) {
        const csvPath = path.resolve(urls);
        const csvData = fs.readFileSync(csvPath, 'utf-8');
        const urlList = csvData.split(',').map(url => url.trim());

        console.log(`Archiving URLs from CSV file: ${csvPath}`);
        for (const url of urlList) {
          const sanitizedUrl = url.split('?')[0];
          console.log(`Archiving URL: ${sanitizedUrl}`);
          await crawlPost(sanitizedUrl);
          // wait for 1 second
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        console.log('Please provide either --url or --urls option.');
      }
    });

  program.parse(process.argv);
}

main();

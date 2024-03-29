import { program } from 'commander';
import { crawlPost, writeFile } from './crawl';
import { login } from './login';
import { getMyArticleUrls } from './utils';
import fs from 'fs';
import path from 'path';

async function main() {
  program
    .command('archive')
    .description('주어진 URL의 게시글을 저장합니다.')
    .option('--url <url>', '게시글 URL')
    .option('--urls <path>', '개행 문자로 구분된 URL 목록이 저장된 파일 경로')
    .option('--dry-run', '실제로 백업하지 않고 URL만 출력합니다.')
    .action(async options => {
      const { url, urls, dryRun } = options;

      if (url) {
        const sanitizedUrl = url.split('?')[0];
        console.log(`Archiving URL: ${sanitizedUrl}`);
        if (!dryRun) {
          const post = await crawlPost(sanitizedUrl);
          if (post) {
            await writeFile(post);
          }
        }
      } else if (urls) {
        const filePath = path.resolve(urls);
        const urlData = fs.readFileSync(filePath, 'utf-8');
        const urlList = urlData.split(/\r?\n/).map(url => url.trim());

        console.log(`Archiving URLs from following file: ${filePath}`);
        for (const url of urlList) {
          const sanitizedUrl = url.split('?')[0];
          console.log(`Archiving URL: ${sanitizedUrl}`);
          if (!dryRun) {
            const post = await crawlPost(sanitizedUrl);
            if (post) {
              await writeFile(post);
            }
            // wait for 0.5 second
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        if (dryRun) {
          urls ? console.log(`Total ${urlList.length} URLs found.`) : console.log('URL found.');
        }
      } else {
        console.log('Please provide either --url or --urls option.');
      }
    });

  program
    .command('backup')
    .description('내가 작성한 모든 게시글을 백업합니다. 아이디와 비밀번호는 절대 저장하지 않습니다.')
    .option('--id <id>', '클리앙 아이디')
    .option('--password <password>', '비밀번호. 2차 인증을 비활성화 해야 합니다.')
    .option('--dry-run', '실제로 백업하지 않고 URL만 출력합니다.')
    .action(async options => {
      const { id, password, dryRun } = options;

      if (id && password) {
        const clienCookie = await login(id, password);
        const articles = await getMyArticleUrls(
          Array.from(clienCookie.keys())
            .map(key => `${key}=${clienCookie.get(key)}`)
            .join('; '),
          'articles', // 나의 게시글
          'title',
        );

        for (const article of articles) {
          console.log(`Archiving URL: ${article.url}`);
          if (!dryRun) {
            const post = await crawlPost(article.url);
            if (post) {
              await writeFile(post);
            }
            // wait for 0.5 second
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }

        if (dryRun) {
          console.log(`Total ${articles.length} articles found.`);

          // Save URLs to a file
          const filePath = path.join(process.cwd(), 'my-articles.txt');
          fs.writeFileSync(filePath, articles.map(article => article.url).join('\n'));
        }
      } else {
        console.log('Please provide --id and --password option.');
      }
    });

  program.parse(process.argv);
}

main();

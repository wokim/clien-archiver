import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import { program } from 'commander';

async function crawlPost(url: string) {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);

    const boardName = $('.board_head .board_name h2').text().trim();
    const category = $('.post_subject .post_category').text().trim();
    const title = $('.post_subject > span:not(.post_category)').text().trim();
    const createdAtRaw = $('.post_view .post_author span:first-child').text().trim();
    const createdAt = moment.tz(createdAtRaw, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul').toISOString();
    const postId = url.split('/').pop()?.split('?')[0];

    let content = $('.post_view .post_content article').html();

    const directory = path.join('articles', boardName);
    const filePath = path.join(directory, `${postId}.json`);

    // 디렉토리 생성
    fs.mkdirSync(directory, { recursive: true });

    // 이미지 다운로드 및 저장
    const imageDirectory = path.join(directory, 'images');
    fs.mkdirSync(imageDirectory, { recursive: true });

    const imageUrls = $('img', content)
      .map((_, img) => $(img).attr('src'))
      .get();

    for (const imageUrl of imageUrls) {
      // const imageFileName = path.basename(imageUrl).split('?')[0];
      const imagePath = path.join(directory, 'images', imageUrl.replace('https://edgio.clien.net', '')).split('?')[0];
      const imageDirectory = path.dirname(imagePath);
      fs.mkdirSync(imageDirectory, { recursive: true });

      const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
      imageResponse.data.pipe(fs.createWriteStream(imagePath));

      // 콘텐츠의 이미지 경로 변경
      if (content) {
        content = content.replace(imageUrl, imagePath.replace(directory, '').replace(/\\/g, '/'));
      }
    }

    const postData = {
      boardName,
      category,
      title,
      createdAt,
      postId,
      content,
    };

    // JSON 파일 생성
    fs.writeFileSync(filePath, JSON.stringify(postData, null, 2));

    console.log(`게시물 저장 완료: ${filePath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`크롤링 에러: ${error.message}`);
    }
  }
}

async function main() {
  program
    .command('archive')
    .description('Archive CLIEN posts')
    .option('--url <url>', 'URL of the post to archive')
    .option('--urls <path>', 'Path to the CSV file containing URLs')
    .action(async options => {
      const { url, urls } = options;

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
        }
      } else {
        console.log('Please provide either --url or --urls option.');
      }
    });

  program.parse(process.argv);
}

main();

import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';
import { program } from 'commander';
import querystring from 'querystring';

const login = async (userId: string, userPassword: string) => {
  let response = await axios.get('https://www.clien.net/service', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Sec-Ch-Ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    },
  });
  const clienCookie: Map<string, string> = new Map<string, string>();
  if (!response) return clienCookie;
  if (!response.headers) return clienCookie;

  let cookies = response.headers['Set-Cookie'];

  if (cookies && Array.isArray(cookies)) {
    cookies
      .map(cookie => cookie.split(';')[0])
      .forEach(cookie => clienCookie.set(cookie.split('=')[0], cookie.split('=')[1]));
  }

  const csrf = response.data.match(/<input type="hidden" name="_csrf" value="(.+?)"/)[1];

  try {
    response = await axios.post(
      'https://www.clien.net/service/login',
      querystring.stringify({
        userId: userId,
        userPassword: userPassword,
        _csrf: csrf,
        deviceId: null,
        totpcode: null,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Cookie: Array.from(clienCookie.keys())
            .map(key => `${key}=${clienCookie.get(key)}`)
            .join('; '),
          Origin: 'https://www.clien.net',
          Referer: 'https://www.clien.net/service/',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-User': '?1',
          'Upgrade-Insecure-Requested': '1',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
        },
      },
    );

    cookies = response.headers['Set-Cookie'];
    if (cookies && Array.isArray(cookies)) {
      cookies
        .map(cookie => cookie.split(';')[0])
        .forEach(cookie => clienCookie.set(cookie.split('=')[0], cookie.split('=')[1]));
    }

    console.info(`로그인 성공`);
  } catch (e) {
    console.error(e);
  }

  return clienCookie;
};

const getMyArticleList = async (cookie: string, type: string, sk: string) => {
  let po = 0;
  const myArticleList: { title: string; url: string }[] = [];

  // eslint-disable-next-line no-constant-condition
  while (true) {
    console.info(`${po + 1}번째 내 글 목록 리스트를 가져옵니다.`);
    const myArticleUrl = `https://www.clien.net/service/mypage/myArticle?&type=${type}&sk=${sk}&sv=&po=${po}`;
    const response = await axios.get(myArticleUrl, {
      headers: {
        Cookie: cookie,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-InSecure-Requests': '1',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
      },
    });
    console.log(`${po + 1}번째 내 글 목록 리스트를 가져와서 필요한 내용을 추출합니다.`);

    const $ = load(response.data);
    const subjectList = $('.list_subject');
    subjectList.each((index, element) => {
      if (!element.attribs.title || !element.attribs.href) return;

      myArticleList.push({
        title: element.attribs.title,
        url: `https:/www.clien.net${element.attribs.href}`
      });
    });

    if (subjectList.length === 0) break;

    po++;

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return myArticleList;
};

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
    .option('--userId <userId>', 'User ID for login')
    .option('--userPassword <userPassword>', 'User password for login')
    .action(async options => {
      const { url, urls, userId, userPassword } = options;

      if (userId && userPassword) {
        const clienCookie = await login(userId, userPassword);
        const articleList = await getMyArticleList(
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

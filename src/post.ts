import axios from 'axios';
import { load } from 'cheerio';

export const getMyPostUrls = async (cookie: string, type: string, sk: string) => {
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
        url: `https:/www.clien.net${element.attribs.href}`,
      });
    });

    if (subjectList.length === 0) break;

    po++;

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return myArticleList;
};

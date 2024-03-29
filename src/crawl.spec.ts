import { crawlPost } from './crawl';

describe('Crawl', () => {
  xit('should crawl a website with external CDN images', async () => {
    const post = await crawlPost('https://www.clien.net/service/board/lecture/13750265');

    expect(post?.body.boardName).toBe('팁과강좌');
    expect(post?.body.category).toBe('기타');
    expect(post?.body.title).toBe('입사 전, 반드시 확인해야 할 연봉 및 처우 내역! - 현명한 연봉 조율');
    expect(post?.body.author).toBe('stillcalm');
    expect(post?.body.createdAt).toBe('2019-07-25T02:01:19.000Z');
    expect(post?.body.postId).toBe('13750265');
    expect(post?.metadata.imageUrls).toEqual(
      expect.arrayContaining([
        {
          url: 'https://k.kakaocdn.net/dn/bDbCnN/btqv2J013Kd/D4JqPz6OPO28hl2D2Oaye0/img.jpg',
          path: 'articles/팁과강좌/images/dn/bDbCnN/btqv2J013Kd/D4JqPz6OPO28hl2D2Oaye0/img.jpg',
        },
        {
          url: 'https://k.kakaocdn.net/dn/t0xj9/btqv2IHMziC/beoY9pAWdkEaIwROfiK64k/img.jpg',
          path: 'articles/팁과강좌/images/dn/t0xj9/btqv2IHMziC/beoY9pAWdkEaIwROfiK64k/img.jpg',
        },
        {
          url: 'https://k.kakaocdn.net/dn/TUSR7/btqv0xVAHOf/4PDRdEUY6rVQ0r8CyUn63k/img.jpg',
          path: 'articles/팁과강좌/images/dn/TUSR7/btqv0xVAHOf/4PDRdEUY6rVQ0r8CyUn63k/img.jpg',
        },
        {
          url: 'https://k.kakaocdn.net/dn/X3hTh/btqv3tdDY9n/D8UYSPkSLpTxBZGMwpZ0h0/img.jpg',
          path: 'articles/팁과강좌/images/dn/X3hTh/btqv3tdDY9n/D8UYSPkSLpTxBZGMwpZ0h0/img.jpg',
        },
      ]),
    );
  });

  xit('should crawl a website', async () => {
    const post = await crawlPost('https://www.clien.net/service/board/park/18676865');

    console.log(post);
    console.log(JSON.stringify(post?.body.comments, null, 2));

    expect(post?.body.boardName).toBe('모두의공원');
    expect(post?.body.category).toBe('');
    expect(post?.body.title).toBe('운영자입니다. 추가 설명 올립니다.');
    expect(post?.body.author).toBe('운영자');
    expect(post?.body.postId).toBe('18676865');

    expect(post?.metadata.directory).toBe('articles/모두의공원');
    expect(post?.metadata.filePath).toBe('articles/모두의공원/18676865.json');
    expect(post?.metadata.imageDirectory).toBe('articles/모두의공원/images');
    expect(post?.metadata.imageUrls.length).toBe(0);
  });

  xit('should crawl a website with images', async () => {
    const post = await crawlPost('https://www.clien.net/service/board/lecture/18668326');

    console.log(post);

    expect(post?.body.boardName).toBe('팁과강좌');
    expect(post?.body.category).toBe('PC/모바일');
    expect(post?.body.title).toBe('웹브라우저에서 광고 차단하는 방법');
    expect(post?.body.author).toBe('에스까르고');
    expect(post?.body.createdAt).toBe('2024-03-27T01:27:33.000Z');
    expect(post?.body.postId).toBe('18668326');

    expect(post?.metadata.directory).toBe('articles/팁과강좌');
    expect(post?.metadata.filePath).toBe('articles/팁과강좌/18668326.json');
    expect(post?.metadata.imageDirectory).toBe('articles/팁과강좌/images');
    expect(post?.metadata.imageUrls).toEqual(
      expect.arrayContaining([
        {
          url: 'https://edgio.clien.net/F01/15015025/395348d1c9ad58.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015025/395348d1c9ad58.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015026/3952e44612118e.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015026/3952e44612118e.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015027/395348e3564890.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015027/395348e3564890.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015030/3952ed86a5c3ce.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015030/3952ed86a5c3ce.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015031/39535223a3e4af.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015031/39535223a3e4af.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015032/3952ed9a0093e2.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015032/3952ed9a0093e2.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015033/3953590040c834.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015033/3953590040c834.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015034/3952f4746dc002.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015034/3952f4746dc002.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015035/39535910baa799.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015035/39535910baa799.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015054/39531778d17057.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015054/39531778d17057.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015055/39537c18b37176.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015055/39537c18b37176.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015059/39532a5407bda2.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015059/39532a5407bda2.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015060/39538ef1f7336e.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015060/39538ef1f7336e.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015063/395333ef4c12e3.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015063/395333ef4c12e3.png',
        },
        {
          url: 'https://edgio.clien.net/F01/15015064/3953988f5265e2.png?scale=width[740],options[limit]',
          path: 'articles/팁과강좌/images/F01/15015064/3953988f5265e2.png',
        },
      ]),
    );
    expect(post!.body.comments!.length).not.toBe(0);
  });
});

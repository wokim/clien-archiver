import { crawlPost } from './crawl';

describe('Crawl', () => {
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
          imageUrl: 'https://edgio.clien.net/F01/15015025/395348d1c9ad58.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015025/395348d1c9ad58.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015026/3952e44612118e.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015026/3952e44612118e.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015027/395348e3564890.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015027/395348e3564890.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015030/3952ed86a5c3ce.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015030/3952ed86a5c3ce.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015031/39535223a3e4af.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015031/39535223a3e4af.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015032/3952ed9a0093e2.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015032/3952ed9a0093e2.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015033/3953590040c834.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015033/3953590040c834.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015034/3952f4746dc002.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015034/3952f4746dc002.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015035/39535910baa799.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015035/39535910baa799.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015054/39531778d17057.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015054/39531778d17057.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015055/39537c18b37176.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015055/39537c18b37176.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015059/39532a5407bda2.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015059/39532a5407bda2.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015060/39538ef1f7336e.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015060/39538ef1f7336e.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015063/395333ef4c12e3.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015063/395333ef4c12e3.png',
        },
        {
          imageUrl: 'https://edgio.clien.net/F01/15015064/3953988f5265e2.png?scale=width[740],options[limit]',
          imagePath: 'articles/팁과강좌/images/F01/15015064/3953988f5265e2.png',
        },
      ]),
    );
    expect(post.body.comments!.length).not.toBe(0);
  });
});

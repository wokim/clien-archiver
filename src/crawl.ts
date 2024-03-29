import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import moment from 'moment-timezone';

export interface Comment {
  html: string;
  text: string;
}

export interface Post {
  boardName: string;
  category: string;
  title: string;
  author?: string; // first version does not have author
  createdAt: string;
  postId: string;
  content: string;
  comments?: Comment[]; // first version does not have comments
}

export interface Metadata {
  directory: string;
  filePath: string;
  imageDirectory: string;
  imageUrls: { url: string; path: string }[];
}

export async function crawlPost(url: string): Promise<{ metadata: Metadata; body: Post } | undefined> {
  try {
    const response = await axios.get(url);
    const $ = load(response.data);

    const boardName = $('.board_head .board_name h2').text().trim();
    const category = $('.post_subject .post_category').text().trim();
    const title = $('.post_subject > span:not(.post_category)').text().trim();
    const createdAtRaw = $('.post_view .post_author span:first-child').text().trim();
    const createdAt = moment.tz(createdAtRaw, 'YYYY-MM-DD HH:mm:ss', 'Asia/Seoul').toISOString();
    const postId = url.split('/').pop()!.split('?')[0];
    const authorElement = $('.content_view .post_info .post_contact .contact_name .nickname');
    let author = '';

    if (authorElement.length > 0) {
      const childElement = authorElement.children('img, span');
      if (childElement.length > 0) {
        author = childElement.attr('title') || '';
      }
    }

    let content = $('.post_view .post_content article').html() || '';

    const comments: Comment[] = [];
    $('.post_comment [data-role="comment"]').each((_, commentElement) => {
      const commentRows = $(commentElement).find('> div');

      commentRows.each((_, rowElement) => {
        const rowClass = $(rowElement).attr('class');
        if (rowClass && rowClass.includes('comment_row') && !rowClass.includes('blocked')) {
          const commentContent = $(rowElement).find('.comment_content .comment_view');
          comments.push({ html: commentContent.html() || '', text: commentContent.text().trim() });
        }
      });
    });

    const directory = path.join('articles', boardName);
    const filePath = path.join(directory, `${postId}.json`);
    const imageDirectory = path.join(directory, 'images');

    const imageUrls = $('img', content)
      .map((_, img) => $(img).attr('src'))
      .get()
      .map(imageUrl => {
        const url = new URL(imageUrl || '');
        const imagePath = path.join(directory, 'images', url.pathname);

        // 콘텐츠의 이미지 경로 변경
        if (content) {
          content = content.replace(imageUrl, imagePath.replace(directory, '').replace(/\\/g, '/'));
        }

        return { url: imageUrl, path: imagePath };
      });

    return {
      metadata: {
        directory,
        filePath,
        imageDirectory,
        imageUrls,
      },
      body: {
        boardName,
        category,
        title,
        author,
        createdAt,
        postId,
        content,
        comments,
      },
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(`크롤링 에러: ${error.message}`);
    }
  }
}

export async function writeFile(post: { metadata: Metadata; body: Post }) {
  try {
    const { directory, imageUrls, filePath } = post.metadata;

    // 디렉토리 생성
    fs.mkdirSync(directory, { recursive: true });

    // 이미지 다운로드 및 저장
    const imageDirectory = path.join(directory, 'images');
    fs.mkdirSync(imageDirectory, { recursive: true });

    for (const imageUrl of imageUrls) {
      const imageDirectory = path.dirname(imageUrl.path);
      fs.mkdirSync(imageDirectory, { recursive: true });

      const imageResponse = await axios.get(imageUrl.url, { responseType: 'stream' });
      imageResponse.data.pipe(fs.createWriteStream(imageUrl.path));
    }

    // JSON 파일 생성
    fs.writeFileSync(filePath, JSON.stringify(post.body, null, 2));
    console.log(`게시물 저장 완료: ${filePath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`파일을 저장하는 중에 에러가 발생하였습니다: ${error.message}`);
    }
  }
}

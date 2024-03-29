import axios from 'axios';

export const login = async (userId: string, userPassword: string) => {
  const response = await axios.get('https://www.clien.net/service', {
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
  if (!response) throw new Error('Failed to get CSRF token');
  if (!response.headers) throw new Error('Failed to get CSRF token');

  let cookies = response.headers['set-cookie'];

  if (cookies && Array.isArray(cookies)) {
    cookies
      .map(cookie => cookie.split(';')[0])
      .forEach(cookie => clienCookie.set(cookie.split('=')[0], cookie.split('=')[1]));
  }

  const csrf = response.data.match(/<input type="hidden" name="_csrf" value="(.+?)"/)[1];

  try {
    const response = await axios.post(
      'https://www.clien.net/service/login',
      {
        userId: userId,
        userPassword: userPassword,
        _csrf: csrf,
        deviceId: `${userId}204912803192`,
        totpcode: null,
      },
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

    cookies = response.headers['set-cookie'];
    if (cookies && Array.isArray(cookies)) {
      cookies
        .map(cookie => cookie.split(';')[0])
        .forEach(cookie => clienCookie.set(cookie.split('=')[0], cookie.split('=')[1]));
    }

    console.info(`로그인 성공`);
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }

  return clienCookie;
};

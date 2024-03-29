# Clien Archiver

Clien-Archiver는 [클리앙]((https://www.clien.net) 웹사이트의 게시물을 로컬 환경에 백업하고 관리할 수 있는 CLI 도구입니다.

## 기능

- 내가 작성한 게시물을 로컬 디스크에 저장할 수 있습니다.
- 단일 게시물 URL 또는 여러 개의 게시물 URL을 파일에서 읽어와 백업할 수 있습니다.
- 게시물의 제목, 작성자, 카테고리, 내용, 작성일, 댓글 등의 정보를 저장합니다.
- 게시물에 포함된 이미지를 로컬 디렉토리에 다운로드하여 저장합니다.
- 저장된 데이터는 JSON 형식으로 저장됩니다.

## 알려진 문제

> 댓글의 이미지와 작성자는 저장하지 않으며, 댓글의 답글이나 사용자 본인이 작성한 댓글도 특별히 구별하지 않습니다.

## 내보내기 플러그인 (예정)

향후 백업된 데이터를 다른 플랫폼으로 내보낼 수 있는 내보내기 플러그인 기능을 개발할 계획입니다. 초기에는 [다모앙](https://damoang.net/)과 [레딧 모공](https://new.reddit.com/r/Mogong/)을 지원할 예정입니다.

## 설치

[여기](https://github.com/wokim/clien-archiver/releases)에서 사전 빌드 된 바이너리를 다운로드 하세요.

```sh
./clien-archiver-<platform>-<arch> --help

# For example,
./client-archiver-macos-x64 --help
```

### Building from Source

```sh
# Clone the project:
$ git clone https://github.com/yourusername/clien-archiver.git

# Navigate to the project directory:
$ cd clien-archiver

# Install the required dependencies:
$ npm install

# Build the project:
$ npm run build

# Run the tool:
node lib/index.js --help

```

## 사용법

### 단일 게시물 백업

주어진 게시물을 백업합니다. 내가 작성한 게시물이 아니어도 상관 없습니다.

```sh
$ clien-archiver archive --url <post URL>

# 예시:
$ clien-archiver archive --url https://www.clien.net/service/board/park/18680440

# dry-run 명령어를 추가하면 실제로 게시물을 저장하지 않고, 처리 결과만을 확인할 수 있습니다.
$ clien-archiver archive --url https://www.clien.net/service/board/park/18680440 --dry-run
Archiving URL: https://www.clien.net/service/board/park/18680440
```

### 여러 게시물 백업

1. 백업할 게시물 URL을 urls.txt 파일에 개행 문자로 구분하여 저장합니다.
2. 다음 명령을 실행합니다.

```sh
$ clien-archiver archive --urls urls.txt

# urls.txt
# URL이 개행 문자로 구분되어 있습니다
$ cat urls.txt
https://www.clien.net/service/board/park/18680440
https://www.clien.net/service/board/park/18680441
https://www.clien.net/service/board/park/18680442
...

# # dry-run 명령어를 추가하면 실제로 게시물을 저장하지 않고, 처리 결과만을 확인할 수 있습니다.
$ clien-archiver archive --urls urls.txt --dry-run
```

### 사용자 글 백업

주어진 사용자 아이디와 비밀번호로 로그인하여 내가 작성한 게시글 목록을 가져옵니다. 반드시 **2단계 인증은 사용안함**으로 설정되어 있어야 합니다. `dry-run` 명령어를 사용한 경우 현재 경로의 `my-articles.txt` 파일에 내가 작성한 모든 게시글의 경로를 저장합니다.

> 아이디와 비밀번호는 절대 저장하지 않습니다. 소스코드가 공개되어 있으므로 확인 가능합니다.

```sh
$ clien-archiver backup --id <사용자 아이디> --password <비밀번호>

# 예시:
$ clien-archiver backup --id myusername --password mypassword

# dry-run 명령어를 추가하면 실제로 게시물을 저장하지 않고, 처리 결과만을 확인할 수 있습니다.
# 현재 경로에 my-articles.txt 라는 파일로 저장합니다.
$ clien-archiver backup --id myusername --password mypassword --dry-run
```

### 도움말

```sh
clien-archiver --help
```

## 파일 구조

백업된 데이터는 다음과 같은 구조로 저장됩니다:

```sh
# articles 폴더를 잘 보관해주세요.
articles/
  Board Name/
    Post ID.json
    images/
      Image File1.jpg
      Image File2.png
      ...
```

- `articles` 디렉토리 내에 각 게시판 이름으로 하위 디렉토리가 생성됩니다.
- 각 게시물은 `게시물 ID.json` 파일로 저장되며, JSON 형식으로 게시물 정보가 포함됩니다.
- 게시물에 포함된 이미지는 `images` 디렉토리에 저장됩니다.

## Contributing

This project is open-source, and contributions are welcome. You can contribute to the project in various ways, such as reporting bugs, requesting features, or improving the code.

## License

This project is licensed under the MIT License.

# Clien Archiver

Clien-Archiver is a CLI tool that allows users to backup and manage posts from the [clien.net](https://www.clien.net) website in a local environment. With this tool, you can save the content and images of [clien](https://www.clien.net) posts to your local environment.

## Features

- Backup a single post URL or multiple post URLs from a CSV file.
- Save post information such as title, category, content, and creation date.
- Download and save images included in the posts to a local directory.
- Saved data is stored in JSON format.

## Installation

### Using Pre-built Binaries

https://github.com/wokim/clien-archiver/releases

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

## Usage

### Backup a Single Post

```sh
clien-archiver archive --url <post URL>

# Example:
clien-archiver archive --url https://www.clien.net/service/board/park/18680440
```

### Backup Multiple Posts

1. Save the post URLs to be backed up in a urls.csv file, separated by commas.
2. Run the following command
   ```sh
   clien-archiver archive --urls urls.csv
   ```

### Help

```sh
clien-archiver --help
```

### File Structure

The backed-up data is stored in the following structure:

```sh
articles/
  Board Name/
    Post ID.json
    images/
      Image File1.jpg
      Image File2.png
      ...
```

- Subdirectories are created within the `articles` directory for each board name.
- Each post is saved as a `Post ID.json` file, containing the post information in JSON format.
- Images included in the posts are saved within the `images` directory.

## Export Plugin (Upcoming Feature)

We plan to develop an export plugin feature in the future, which will allow exporting the backed-up data to other platforms. The initial support will include `Damoang` and `Reddit`.

## Contributing

This project is open-source, and contributions are welcome. You can contribute to the project in various ways, such as reporting bugs, requesting features, or improving the code.

## License

This project is licensed under the MIT License.

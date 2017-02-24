# Mandate

[![Greenkeeper badge](https://badges.greenkeeper.io/ForbesLindesay/mandate.svg)](https://greenkeeper.io/)

Upload a directory to an S3 bucket

## Command Line

### Installation

    npm install mandate -g

### Usage

    mandate <source-dir> -b <bucket-name> -k <key> -s <secret> -r <region>

### Configuration

To save you typing in the command line options every time, stop accepts toml configuration files in the location .mandate.toml. An example configuration file might look like:

.mandate.toml

```toml
[aws]
bucket="example.com"
key="<AWS-KEY>"
secret="<AWS-SECRET>"
region="<AWS-REGION>"
[options]
filter=["!/node_modules", "!/.git"]
```

Alternatively, you can use environment variables and configure it using:

 - S3_BUCKET
 - S3_KEY
 - S3_SECRET
 - S3_REGION

## API

```js
mandate(__dirname, {
  bucket: '<bucket>',
  key: '<key>',
  secret: '<secret>',
  region: '<region>'
}, {filter: function (path) { return true }}, function (err) {
  //done
})
```

## License

MIT
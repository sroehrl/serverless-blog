
# blua.blue Serverless Framework Node Express API on AWS

This POC is based on the serverless node/express/api template with added support for 
s3 bucket storage and rendering.

## Setup

- Create a bucket and ensure that your AWS cli AIM has the required permissions to read & write to this bucket.
- Change line 8 of handler.js accordingly: `const bucketName = 'my-article-storage-bucket'`;


## Usage

### Deployment

Install dependencies with:

```
npm install
```

and then deploy with:

```
serverless deploy
```

## Enhance

The current setup is a POC to ease local development (when using serverless-local).
Ultimately, you may want to set up your bucket as a website and permanently render
what is now done in `app.get('/:slug?)` to HTML files (pug.compileFile) to enjoy a static blog.

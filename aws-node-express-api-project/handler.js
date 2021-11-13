const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require('body-parser')
const aws = require("aws-sdk");
const s3 = new aws.S3();
const app = express();
const cors = require("cors");
const bucketName = 'articles-blua-blue';
app.set('views', './views');
app.set('view engine', 'pug');
const allowBluaBlue = {
  origin: 'https://blua.blue'
}
app.use(cors(allowBluaBlue));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const menu = [];


app.get('/:slug?', (req, res) => {
  s3.listObjects({Bucket:bucketName}, (err,data)=>{
    for (let i = 0; i < data.Contents.length; i++) {
      s3.getObject({Key: data.Contents[i].Key, Bucket: bucketName}, (err, object)=>{
        menu.push(JSON.parse(object.Body.toString()))
        if(i === data.Contents.length - 1){
          if (req.params.slug) {
            res.render('blog', {
              article: menu.find(article => article.slug === req.params.slug),
              articles: menu
            })
          } else if (menu.length > 0) {
            res.redirect('/' + menu[0].slug)
          } else {
            res.render('No entry yet')
          }
        }
      })

    }

  })


})

app.post("/receive", (req, res, next) => {
  const fileName = req.body.payload.slug + '.json';
  if(req.body.event === 'deleted'){
    // if deleted
    s3.deleteObject({Bucket:bucketName, Key:fileName}, (err,response)=>{
      res.json({received: true})
    })
  } else {
    // create or update
    s3.putObject({Bucket:bucketName, Key:fileName, Body: JSON.stringify(req.body.payload), ContentType: 'application/json'}, (err, data)=>{
      if(err){
        const answer = {data,err}
        return res.json(answer).status(500)
      }
      res.json({received: true})
    })
  }
});



module.exports.handler = serverless(app);

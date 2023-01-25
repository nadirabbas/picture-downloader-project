const express = require('express')
const download = require('image-downloader');
const fs = require('fs')
const path = require('path')

const errors = {};
const images = {};

const fetch = require("node-fetch-commonjs")

const app = express()

app.use(express.json())

app.get('/download', (req, res) => {
  const {url, index} = req.query
  if(!url) return res.status(400).send('no img url specified for ' + index)

  res.send('ok')

  fetch(url).then(res => res.text()).then(res => console.log(res))


  // download.image({
  //   url: url,
  //   dest: path.resolve(__dirname, `./images/${index}.JPG`)
  // })
  // .then(({ filename }) => {
  //   images[index] = filename 
  //   fs.writeFile('./images.json', JSON.stringify(images), {}, () => {})
  // })
  // .catch((err) => {
  //   console.log(err)
  //   errors[index] = err
  //   fs.writeFile('./errors.json', JSON.stringify(errors), {}, () => {})
  // });
})

app.listen(84, () => console.log('Server started at 84'))
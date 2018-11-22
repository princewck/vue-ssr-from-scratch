const Vue = require('vue');
const express = require('express');
const path = require('path');
const clientManifest = require('../dist/vue-ssr-client-manifest.json');
const renderer = require('vue-server-renderer').createBundleRenderer(path.resolve(__dirname, './ssr-bundle/vue-ssr-server-bundle.json'), {
  runInNewContext: false,
  template: require('fs').readFileSync('./app/template/index.template.html', 'utf-8'),
  clientManifest,
});

const server = express();
server.get('*', (req, res, next) => {
  const context = {url: req.url, title: '同构测试'};
  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.error(err);
      if (err.code === 404) {
        next();
      } else {
        res.status(500).send('服务器内部错误');
      }
    } else {
      res.send(html);
    }
  });
});
server.use(express.static(path.resolve(__dirname, '../dist')));
server.listen(8088);
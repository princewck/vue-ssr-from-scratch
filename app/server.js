const Vue = require('vue');
const server = require('express')();
const path = require('path');
const renderer = require('vue-server-renderer').createBundleRenderer(path.resolve(__dirname, './ssr-bundle/vue-ssr-server-bundle.json'), {
  runInNewContext: false,
  template: require('fs').readFileSync('./app/template/index.template.html', 'utf-8')
});

// const createApp = require('../src/app');

server.get('*', (req, res) => {
  const context = {url: req.url, title: '同构测试'};
  // createApp(context).then(app => {
  //   renderer.renderToString(app, (err, html) => {
  //     if (err) {
  //       if (err.code === 404) {
  //         res.status(404).end('Page not found')
  //       } else {
  //         res.status(500).end('服务器内部错误');
  //       }
  //     } else {
  //       res.end(html);
  //     }
  //   });
  // });

  renderer.renderToString(context, (err, html) => {
    if (err) {
      console.error(err);
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('服务器内部错误');
      }
    } else {
      res.end(html);
    }
  });
})

server.listen(8088);
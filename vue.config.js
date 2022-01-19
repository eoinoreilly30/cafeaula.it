const path = require('path');
const PrerenderSpaPlugin = require('prerender-spa-plugin');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: config => {
    // config.output.filename = "js/[name].[contenthash].js";
    // config.output.chunkFilename = "js/[name].[contenthash].js";

    config.plugins.push(new PrerenderSpaPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/'],
      renderer: new PrerenderSpaPlugin.PuppeteerRenderer({
        // We need to inject a value so we're able to
        // detect if the page is currently pre-rendered.
        inject: {},
        headless: false
      }),
    }),);
  },
}

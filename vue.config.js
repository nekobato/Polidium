const path = require('path');

module.exports = {
  outputDir: 'dist/renderer',
  pages: {
    index: {
      entry: 'src/renderer/main.ts',
      template: './public/index.html',
    },
  },
  configureWebpack: config => {
    const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));
    svgRule.test = /\.(png|jpe?g|gif|webp)$/;
    config.module.rules.push({
      test: /\.svg$/,
      loader: 'vue-svg-loader',
    });
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', path.join(__dirname, '/src/renderer'));
  },
};

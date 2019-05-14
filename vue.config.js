module.exports = {
  configureWebpack: config => {
    const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));
    svgRule.test = /\.(png|jpe?g|gif|webp)$/;
    config.module.rules.push({
      test: /\.svg$/,
      loader: 'vue-svg-loader'
    });
  }
};

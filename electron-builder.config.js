const package = require('./package.json');

module.exports = {
  appId: 'net.nekobato.polidium',
  mac: {
    category: 'public.app-category.video',
    icon: './public/app.icns',
    target: 'default',
  },
  asar: true,
  directories: {
    output: 'release/${version}',
  },
  files: ['dist'],
  mac: {
    category: 'public.app-category.productivity',
    target: ['dmg'],
    // identify: undefined,
    icon: './build/icon.icns',
  },
  buildVersion: package.version,
};

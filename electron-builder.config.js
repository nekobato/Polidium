const package = require('./package.json');

module.exports = {
  appId: 'net.nekobato.polidium',
  mac: {
    category: 'public.app-category.video',
    icon: './build/icon.icns',
    target: ['dmg'],
  },
  asar: true,
  directories: {
    output: 'release/${version}',
  },
  files: ['dist'],
  buildVersion: package.version,
};

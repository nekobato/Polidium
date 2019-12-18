module.exports = {
  configureWebpack: {
    // Configuration applied to all builds
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'net.netkobato.polidium',
        mac: {
          category: 'public.app-category.video',
          icon: './public/app.icns',
          target: 'default',
        },
      },
      chainWebpackMainProcess: config => {
        // Chain webpack config for electron main process only
      },
      chainWebpackRendererProcess: config => {},
      // Use this to change the entrypoint of your app's main process
      mainProcessFile: 'src/main/app.ts',
      // Provide an array of files that, when changed, will recompile the main process and restart Electron
      // Your main process file will be added by default
      mainProcessWatch: ['src/main/**/*.ts'],
    },
  },
};

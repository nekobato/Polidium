const pkg = require("./package.json");

/**
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: "net.nekobato.polidium",
  asar: true,
  productName: "Polidium",
  directories: {
    output: `release/${pkg.version}`,
  },
  files: [
    "dist",
    "img",
    "!dist/assets/*.map",
    "dist-electron",
    {
      from: "node_modules/file-icon/file-icon",
      to: "dist-electron/file-icon",
    },
  ],
  mac: {
    target: ["default"],
    icon: "public/icons/mac/icon.icns",
    category: "public.app-category.video",
    entitlements: "build/entitlements.mac.plist",
    entitlementsInherit: "build/entitlements.mac.plist",
    publish: ["github"],
    notarize: true,
  },
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
  },
  // nsis: {
  //   oneClick: false,
  //   perMachine: false,
  //   allowToChangeInstallationDirectory: true,
  //   deleteAppDataOnUninstall: false,
  // },
  // linux: {
  //   target: ["AppImage"],
  // },
};

module.exports = config;

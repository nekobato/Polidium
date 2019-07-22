import { mode } from '../values';

const state = {
  settings: localStorage.Settings
    ? JSON.parse(localStorage.Settings)
    : {
        opacity: 100,
        hideOnLauncher: false,
      },
  window: {
    onMouse: false,
  },
  mode: mode.video,
  video: {
    source: {
      path: '',
      name: '',
    },
    media: {
      index: 0,
      duration: 0,
      currentTime: 0,
    },
    fileList: {
      isVisible: false,
      data: [],
    },
  },
  web: {
    url: 'https://google.com',
    action: '',
    histories: [],
    canGoBack: false,
    canGoForward: false,
  },
  views: {
    window: false,
    controller: '',
  },
};

export type State = typeof state;

export default state;

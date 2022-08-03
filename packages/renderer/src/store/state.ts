import { mode } from '../values';

const state: State = {
  settings: localStorage.Settings ? JSON.parse(localStorage.Settings) : { opacity: 100, hideOnLauncher: false },
  settingsView: false,
  window: {
    onMouse: false,
  },
  mode: mode.web,
  video: {
    source: {
      path: '',
      name: '',
    },
    media: {
      isPlaying: false,
      index: 0,
      duration: 0,
      currentTime: 0,
    },
    fileList: [],
    canGoBack: false,
    canGoForward: false,
  },
  web: {
    url: 'https://google.com',
    action: '',
    histories: [],
    canGoBack: false,
    canGoForward: false,
  },
  resizing: false,
};

export type State = {
  settings: {
    opacity: number;
    hideOnLauncher: boolean;
  };
  settingsView: boolean;
  window: {
    onMouse: boolean;
  };
  mode: string;
  video: {
    source: {
      path: string;
      name: string;
    };
    media: {
      isPlaying: boolean;
      index: number;
      duration: number;
      currentTime: number;
    };
    fileList: {
      name: string;
      path: string;
    }[];
    canGoBack: boolean;
    canGoForward: boolean;
  };
  web: {
    url: string;
    action: string;
    histories: {
      title: string;
      url: string;
    }[];
    canGoBack: boolean;
    canGoForward: boolean;
  };
  resizing: boolean;
};

export default state;

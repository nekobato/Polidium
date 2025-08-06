import { defineStore } from 'pinia'

interface NavigationState {
  canGoBack: boolean
  canGoForward: boolean
  isLoading: boolean
  url: string
}

interface NavigationHistoryEntry {
  url: string
  title: string
}

interface NavigationHistory {
  currentIndex: number
  entries: NavigationHistoryEntry[]
}

export const useWebStore = defineStore('web', {
  state: () => ({
    src: '',
    currentUrl: '', // URLインプット用の現在のURL
    navigationState: {
      canGoBack: false,
      canGoForward: false,
      isLoading: false,
      url: ''
    } as NavigationState,
    navigationHistory: {
      currentIndex: -1,
      entries: []
    } as NavigationHistory
  }),
  getters: {
    backHistory: (state) => {
      if (state.navigationHistory.currentIndex <= 0) return []
      return state.navigationHistory.entries.slice(0, state.navigationHistory.currentIndex).reverse()
    },
    forwardHistory: (state) => {
      if (state.navigationHistory.currentIndex >= state.navigationHistory.entries.length - 1) return []
      return state.navigationHistory.entries.slice(state.navigationHistory.currentIndex + 1)
    }
  },
  actions: {
    openUrl (payload: { src: string }) {
      this.src = payload.src
    },
    updateNavigationState (payload: NavigationState) {
      this.navigationState = { ...payload }
      // ナビゲーション状態からURLをcurrentUrlに反映
      if (payload.url) {
        this.currentUrl = payload.url
      }
    },
    updateNavigationHistory (payload: NavigationHistory) {
      this.navigationHistory = { ...payload }
    },
    setCurrentUrl (url: string) {
      this.currentUrl = url
    }
  }
})

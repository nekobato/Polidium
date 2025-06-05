import { defineStore } from 'pinia'

function getSettingsFromLocalStrage () {
  return localStorage.settings ? JSON.parse(localStorage.settings) : {
    player: {
      mode: 'video-player',
      opacity: 0.05,
      clickThrough: true,
      resizeMode: false
    }
  }
}

export const useSettingsStore = defineStore('settings', {
  state: () => getSettingsFromLocalStrage(),
  actions: {
    changeMode (mode: string) {
      this.player.mode = mode
    },
    changeOpacity (newOpacity: number) {
      this.player.opacity = newOpacity
      localStorage.setItem('settings', JSON.stringify(this.$state))
    },
    setClickthrough (payload: { clickThrough: boolean }) {
      this.player.clickThrough = payload.clickThrough
    },
    reload () {
      window.location.reload()
    },
    reset () {
      localStorage.removeItem('queues')
      localStorage.removeItem('settings')
      window.location.reload()
    },
    openUrl () {
      this.player.mode = 'web-player'
      localStorage.setItem('settings', JSON.stringify(this.$state))
    },
    videoSelect () {
      this.player.mode = 'video-player'
      localStorage.setItem('settings', JSON.stringify(this.$state))
    },
    resizePlayer (payload: { mode: boolean }) {
      this.player.resizeMode = payload.mode
      this.player.clickThrough = !payload.mode
    }
  }
})

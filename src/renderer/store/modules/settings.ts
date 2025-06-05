import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

interface SettingsState {
  player: {
    mode: string
    opacity: number
    clickThrough: boolean
    resizeMode: boolean
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const state = useStorage<SettingsState>('settings', {
    player: {
      mode: 'video-player',
      opacity: 0.05,
      clickThrough: true,
      resizeMode: false
    }
  })

  const player = computed(() => state.value.player)

  function changeMode (mode: string) {
    state.value.player.mode = mode
  }

  function changeOpacity (newOpacity: number) {
    state.value.player.opacity = newOpacity
  }

  function setClickthrough (payload: { clickThrough: boolean }) {
    state.value.player.clickThrough = payload.clickThrough
  }

  function reload () {
    window.location.reload()
  }

  function reset () {
    localStorage.removeItem('queues')
    localStorage.removeItem('settings')
    window.location.reload()
  }

  function openUrl () {
    state.value.player.mode = 'web-player'
  }

  function videoSelect () {
    state.value.player.mode = 'video-player'
  }

  function resizePlayer (payload: { mode: boolean }) {
    state.value.player.resizeMode = payload.mode
    state.value.player.clickThrough = !payload.mode
  }

  return {
    player,
    changeMode,
    changeOpacity,
    setClickthrough,
    reload,
    reset,
    openUrl,
    videoSelect,
    resizePlayer
  }
})

import { defineStore } from 'pinia'

export const useWebStore = defineStore('web', {
  state: () => ({
    src: ''
  }),
  actions: {
    openUrl (payload: { src: string }) {
      this.src = payload.src
    }
  }
})

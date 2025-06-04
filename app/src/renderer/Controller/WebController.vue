<template>
  <div class="web">
    <form @submit.prevent="submitURL">
      <div class="input-field">
        <input id="url_input" type="text" placeholder="URL" v-model="url" @keydown.86="tryPasteClipboard" />
        <label for="url_input">{{ encodedURL }}</label>
      </div>
    </form>
    <div class="row click-through">
      <div class="col s6 no-padding">
        <span class="grey-text">Player ClickThrough is</span>
      </div>
      <div class="col s6 no-padding">
        <div class="switch">
          <label>
            <span>Off</span>
            <input type="checkbox" :checked="clickThrough" @change="inputClickThrough" />
            <span class="lever"></span>
            <span>On</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ipc from 'renderer/ipc'
import { clipboard } from 'electron'
import xss from 'xss'
import * as types from 'root/mutation-types'
import { useStore } from 'vuex'

const store = useStore()
const url = ref('')

const encodedURL = computed(() => {
  const encoded = url.value.match(/^https?:\/\//g) ? url.value : 'http://' + url.value
  return xss(encoded)
})

const clickThrough = computed(() => store.state.settings.player.clickThrough)

function submitURL () {
  if (!encodedURL.value.match(/^https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+\$,%#]+$/)) {
    return false
  }
  ipc.commit('OPEN_URL', { src: encodedURL.value })
}

function tryPasteClipboard (e: KeyboardEvent) {
  if (e.metaKey !== true) return
  url.value = clipboard.readText()
}

function inputClickThrough (e: Event) {
  ipc.commit(types.SET_CLICKTHROUGH, { clickThrough: (e.target as HTMLInputElement).checked })
}
</script>

<style lang="scss" scoped>
.web {
  padding: 20px;
}
.input-field label {
  display: inline-block;
  top: 3.5rem;
  word-break: break-all;
  max-height: 4.5rem;
  overflow: hidden;
}
.click-through {
  padding-top: 4rem;
}
.switch {
  text-align: center;
}
</style>


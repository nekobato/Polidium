<template>
  <ScreenFrame>
    <component :is="mode" />
  </ScreenFrame>
</template>
<script lang="ts">
import Vue from 'vue';
import ScreenFrame from '@/components/ScreenFrame.vue';
import Video from '@/components/Mode/Video.vue';
import Web from '@/components/Mode/Web.vue';

export default Vue.extend({
  components: {
    ScreenFrame,
    Video,
    Web,
  },
  computed: {
    mode(): string {
      return this.$store.state.mode;
    },
  },
});
</script>

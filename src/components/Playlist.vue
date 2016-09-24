<template lang="jade">
ul.collection
  li.collection-item(v-for="queue in queues", track-by="$index") file name
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      queues: 'queues'
    })
  },
}
</script>
<style lang="stylus">
@require "~stylesheets/variable";


.collection {
  width: 100%
}
</style>

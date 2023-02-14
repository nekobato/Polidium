<script lang="ts" setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { darkTheme, NConfigProvider } from "naive-ui";

const router = useRouter();

onMounted(() => {
  console.log(router.currentRoute);
});
</script>
<template>
  <n-config-provider class="config-provider" :theme="darkTheme">
    <router-view />
  </n-config-provider>
</template>
<style lang="scss" scoped>
.config-provider {
  display: contents;
}
</style>

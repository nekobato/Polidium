<template>
  <div class="playlist">
    <div class="empty-queue" v-show="queueIsEmpty">
      <el-empty description="Drop Movie files? Here" />
    </div>
    <el-tree
      class="queue-tree"
      v-show="!queueIsEmpty"
      :data="treeData"
      node-key="id"
      draggable
      :highlight-current="true"
      :current-node-key="playPointer ?? undefined"
      :allow-drop="allowDrop"
      @node-click="onNodeClick"
      @node-drop="onNodeDrop"
    >
      <template #default="{ data }">
        <div class="tree-node-content">
          <span class="truncate">{{ data.name }}</span>
          <el-button
            type="danger"
            size="small"
            circle
            class="playlist-deleter"
            @click.stop.prevent="removeByData(data)"
          >
            <Icon icon="mingcute:close-line" />
          </el-button>
        </div>
      </template>
    </el-tree>
    <div class="clear-all" v-show="!queueIsEmpty">
      <el-button type="danger" class="clear-btn" @click="clear">
        <Icon icon="mingcute:delete-2-line" class="icon" />
        <span class="clear-text">Clear Playlist</span>
      </el-button>
    </div>
    <el-card class="video-controller-card" shadow="never">
      <div class="video-controller">
        <el-button
          class="pause-btn"
          v-if="isPlaying"
          type="primary"
          circle
          size="large"
          @click="pause"
        >
          <Icon icon="mingcute:pause-line" class="white-text" />
        </el-button>
        <el-button
          class="play-btn"
          v-if="!isPlaying"
          type="primary"
          circle
          size="large"
          @click="resume"
        >
          <Icon icon="mingcute:play-line" class="white-text" />
        </el-button>
        <div class="seekbar-container">
          <el-slider
            class="seekbar"
            id="seekbar"
            :min="0"
            :max="100"
            :model-value="currentTime"
            @input="inputCurrentTime"
            show-tooltip
          />
        </div>
        <div class="duration">
          <el-tag type="info" effect="dark" class="duration-text">{{
            videoRemaining
          }}</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useVideoStore } from "@/renderer/store/modules/video";
import { useSettingsStore } from "@/renderer/store/modules/settings";
import type { NodeDropType } from "element-plus/es/components/tree/src/tree.type";
import type Node from "element-plus/es/components/tree/src/model/node";

const videoStore = useVideoStore();
const settingsStore = useSettingsStore();

const queues = computed(() => videoStore.queues);
const playPointer = computed(() => videoStore.playPointer);
const queueIsEmpty = computed(() => queues.value.length === 0);
const video = computed(() => videoStore.video);
const isPlaying = computed(() => video.value.isPlaying);
const videoRemaining = computed(() => {
  const remainSeconds = Math.floor(
    video.value.duration - video.value.currentTime
  );
  return `${Math.floor(remainSeconds / 60)}:${(
    "0" +
    (remainSeconds % 60)
  ).slice(-2)}`;
});
const currentTime = computed(() => {
  const percentage = (video.value.currentTime / video.value.duration) * 100;
  return isNaN(percentage) ? 0 : percentage;
});

const treeData = computed(() => queues.value.map((q, i) => ({ ...q, id: i })));

function removeByData(data: { name: string; path: string }) {
  const index = queues.value.findIndex((q) => q === data);
  remove(index);
}

function allowDrop(_dragging: Node, _drop: Node, type: NodeDropType) {
  return type !== "inner";
}

function onNodeClick(_data: any, node: Node) {
  const index = (node.data as any).id;
  play(index);
}

function onNodeDrop(draggingNode: Node, dropNode: Node, type: NodeDropType) {
  const oldIndex = (draggingNode.data as any).id;
  let newIndex = (dropNode.data as any).id;
  if (type === "after") newIndex += 1;
  if (oldIndex < newIndex) newIndex -= 1;
  if (type !== "inner") {
    videoStore.sortQueue({ oldIndex, newIndex });
  }
}

function play(index: number) {
  videoStore.selectVideo({ index });
  settingsStore.videoSelect();
}

function resume() {
  videoStore.resumeFile();
}

function pause() {
  videoStore.pauseFile();
}

function remove(index: number) {
  videoStore.removeQueue({ index });
}

function clear() {
  videoStore.clearQueues();
}

function inputCurrentTime(value: number) {
  videoStore.videoSeek({ percentage: value });
}
</script>

<style lang="scss" scoped>
.playlist {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 0 0 0;
}

.empty-queue {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 180px;
}

.queue-tree {
  width: 100%;
  margin-bottom: 12px;
}
.tree-node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2px 8px 2px 0;
}
.truncate {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}
.playlist-deleter {
  margin-left: 8px;
}
.clear-all {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}
.clear-btn {
  font-weight: 500;
}
.video-controller-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin: 0 auto;
  max-width: 480px;
  padding: 16px 24px 12px 24px;
}
.video-controller {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.seekbar-container {
  flex: 1 1 auto;
  margin: 0 16px;
}
.seekbar {
  width: 100%;
}
.duration {
  min-width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.duration-text {
  font-size: 14px;
  padding: 2px 10px;
}
</style>

<template>
  <div class="playlist">
    <div class="empty-queue" v-show="queueIsEmpty">
      <span class="grey-text">Drop Movie files? Here</span>
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
        <span class="truncate">{{ data.name }}</span>
        <i
          class="material-icons playlist-deleter"
          @click.stop.prevent="removeByData(data)"
          >close</i
        >
      </template>
    </el-tree>
    <div class="clear-all" v-show="!queueIsEmpty">
      <div class="clear-btn" @click="clear">
        <i class="material-icons">clear</i>
        <span class="clear-text">Clear Playlist</span>
      </div>
    </div>
    <div class="blue-grey darken-2 center video-controller">
      <button class="btn pause-btn" v-if="isPlaying" @click="pause">
        <i class="material-icons white-text">pause</i>
      </button>
      <button class="btn play-btn" v-if="!isPlaying" @click="resume">
        <i class="material-icons white-text">play_arrow</i>
      </button>
      <div class="seekbar-container">
        <el-slider
          class="seekbar"
          id="seekbar"
          :min="0"
          :max="100"
          :model-value="currentTime"
          @input="inputCurrentTime"
        />
      </div>
      <div class="duration">
        <span class="duration-text">{{ videoRemaining }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useVideoStore } from "@/renderer/store/modules/video";
import ipc from "@/renderer/ipc";
import * as types from "@/mutation-types";
import type { NodeDropType } from "element-plus/es/components/tree/src/tree.type";
import type Node from "element-plus/es/components/tree/src/model/node";

const videoStore = useVideoStore();

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
    ipc.commit(types.SORT_QUEUE, { oldIndex, newIndex });
  }
}

function play(index: number) {
  ipc.commit(types.VIDEO_SELECT, { index });
}

function resume() {
  ipc.commit(types.RESUME_FILE, {});
}

function pause() {
  ipc.commit(types.PAUSE_FILE, {});
}

function remove(index: number) {
  ipc.commit(types.REMOVE_QUEUE, { index });
}

function clear() {
  ipc.commit(types.CLEAR_QUEUES, {});
}

function inputCurrentTime(value: number) {
  ipc.commit(types.VIDEO_SEEK, { percentage: value });
}
</script>

<style lang="scss" scoped>
.play-controller {
  text-align: center;
}
.playlist-deleter {
  right: 5px;
  display: none;
  position: absolute;
}
.queue-tree {
  width: 100%;
}
.queue-tree .el-tree-node__content {
  position: relative;
  cursor: pointer;
}
.queue-tree .el-tree-node__content:hover .playlist-deleter {
  display: inline-block;
  color: #9e9e9e;
}
.queue-tree .is-current > .el-tree-node__content {
  background: #22b4e2;
  color: #fff;
}
.queue-tree .is-current > .el-tree-node__content .playlist-deleter {
  color: #fff;
}
.clear-all {
  text-align: center;
  padding: 20px 0 30px;
}
.clear-all .clear-btn {
  display: block;
  margin: auto;
  width: 100px;
  color: #999;
  cursor: pointer;
}
.clear-all .clear-btn:hover {
  color: #666;
}
.clear-all .clear-text,
.clear-all .material-icons {
  display: block;
}
.clear-all .material-icons {
  font-size: 24px;
}
.playlist {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.empty-queue {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto 0;
  border: 2px dotted #ccc;
  border-radius: 5px;
  width: 280px;
  height: 210px;
}
.video-controller {
  position: absolute;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 24px;
}
.video-controller .play-btn,
.video-controller .pause-btn {
  display: inline-block;
  padding: 0 1rem;
  height: 24px;
  line-height: 24px;
  vertical-align: top;
}
.video-controller .seekbar-container {
  flex-grow: 1;
  display: inline-block;
  padding: 0 10px;
  line-height: 18px;
}
.video-controller .seekbar {
  border: 0;
  border-radius: 2px;
  margin: 0;
}
.video-controller .duration {
  width: 50px;
  text-align: right;
  padding: 0 6px 0 0;
}
.video-controller .duration-text {
  line-height: 24px;
  white-space: nowrap;
  color: #ccc;
}
</style>

<template>
  <div class="playlist">
    <div class="video-actions">
      <div class="action-buttons">
        <el-button class="prev-button" type="primary" circle :disabled="!canPlayPrevious" @click="playPrevious">
          <Icon icon="mingcute:skip-previous-line" class="white-text" />
        </el-button>
        <el-button class="pause-button" v-if="isPlaying" type="primary" size="large" circle @click="pause">
          <Icon icon="mingcute:pause-line" class="white-text" />
        </el-button>
        <el-button class="play-button" v-if="!isPlaying" type="primary" size="large" circle :disabled="!canPlay" @click="resume">
          <Icon icon="mingcute:play-line" class="white-text" />
        </el-button>
        <el-button class="next-button" type="primary" circle :disabled="!canPlayNext" @click="playNext">
          <Icon icon="mingcute:skip-forward-line" class="white-text" />
        </el-button>
      </div>
      <div class="seekbar-container">
        <el-slider class="seekbar" id="seekbar" :min="0" :max="100" :model-value="currentTime" @input="inputCurrentTime" show-tooltip />
      </div>
      <el-tag type="info" class="duration" size="small">{{ videoRemaining }}</el-tag>
    </div>

    <div class="empty-queue" v-show="queueIsEmpty">
      <Icon icon="mingcute:film-line" class="empty-icon" />
      <span class="empty-text">No videos</span>
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
          <el-button plain size="small" class="playlist-deleter" text @click.stop.prevent="removeByData(data)">
            <Icon icon="mingcute:close-line" />
          </el-button>
        </div>
      </template>
    </el-tree>

    <div class="list-actions">
      <el-button type="primary" @click="openFileDialog" round size="small" class="add-video-btn">
        <Icon icon="mingcute:add-line" />
      </el-button>
      <el-button v-show="!queueIsEmpty" class="clear-btn" @click="clear" size="small" round>
        <Icon icon="mingcute:delete-2-line" class="icon" />
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useVideoStore } from "@/store/modules/video";
import { useSettingsStore } from "@/store/modules/settings";
import ipc from "@/ipc";
import * as types from "@/mutation-types";
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
  const remainSeconds = Math.floor(video.value.duration - video.value.currentTime);
  return `${Math.floor(remainSeconds / 60)}:${("0" + (remainSeconds % 60)).slice(-2)}`;
});
const currentTime = computed(() => {
  const percentage = (video.value.currentTime / video.value.duration) * 100;
  return isNaN(percentage) ? 0 : percentage;
});

const treeData = computed(() => queues.value.map((q, i) => ({ ...q, id: i })));

const canPlay = computed(() => {
  return queues.value.length > 0 && videoStore.playPointer !== undefined;
});

const canPlayPrevious = computed(() => {
  return queues.value.length > 0 && videoStore.playPointer && videoStore.playPointer > 0;
});

const canPlayNext = computed(() => {
  return queues.value.length > 0 && videoStore.playPointer && videoStore.playPointer < queues.value.length - 1;
});

function removeByData(data: { name: string; path: string; id: number }) {
  const index = data.id;
  remove(index);
}

function allowDrop(_dragging: Node, _drop: Node, type: NodeDropType) {
  return type !== "inner";
}

function onNodeClick(_data: any, node: Node) {
  console.log("Node clicked:", _data, node);
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
  const file = queues.value[index];
  console.log("Playing file:", file);
  if (!file) {
    console.error("Invalid file");
    return;
  }

  // まずはビデオ選択状態を更新
  videoStore.selectVideo({ index });
  ipc.commit(types.VIDEO_SELECT, { index });

  // 次にビデオプレイヤーモードに切り替え
  settingsStore.changeMode("video-player");
  ipc.commit(types.CHANGE_MODE, "video-player");

  // ファイル情報をIPCを通して送信
  const fileInfo = {
    name: file.name,
    // storeに保存されているパスは既に絶対パスなので、そのまま使用
    path: file.path || "",
  };

  // IPCでファイル情報を送信（メインプロセスでパス解決される）
  ipc.commit(types.PLAY_FILE, { file: fileInfo });
  settingsStore.videoSelect();
}

function resume() {
  ipc.commit(types.RESUME_FILE, {});
}

function pause() {
  ipc.commit(types.PAUSE_FILE, {});
}

function playPrevious() {
  if (canPlayPrevious.value) {
    videoStore.selectVideo({ index: videoStore.playPointer! - 1 });
  }
}

function playNext() {
  if (canPlayNext.value) {
    videoStore.selectVideo({ index: videoStore.playPointer! + 1 });
  }
}

function remove(index: number) {
  videoStore.removeQueue({ index });
}

function clear() {
  videoStore.clearQueues();
}

function inputCurrentTime(value: number) {
  ipc.commit(types.VIDEO_SEEK, { percentage: value });
}

async function openFileDialog() {
  try {
    // Electronのネイティブダイアログを使用
    const result = await ipc.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Video Files", extensions: ["mp4", "webm", "mov", "avi", "mkv", "m4v", "3gp", "flv", "wmv"] }],
    });

    if (!result.canceled && result.filePaths) {
      result.filePaths.forEach((filePath: string) => {
        // ファイル名をパスから抽出
        const fileName = filePath.split("/").pop() || filePath.split("\\").pop() || "Unknown";

        const fileInfo = {
          name: fileName,
          path: filePath,
        };
        videoStore.addQueue(fileInfo);
      });
    }
  } catch (error) {
    console.error("Error opening file dialog:", error);
  }
}

ipc.on(types.VIDEO_CANPLAY, (...args: unknown[]) => {
  const data = args[0] as { duration: number };
  console.log("[VideoPlayer] Video can play:", data);
  videoStore.videoCanplay({ duration: data.duration });
});

ipc.on(types.VIDEO_TIMEUPDATE, (...args: unknown[]) => {
  const data = args[0] as { currentTime: number };
  console.log("[VideoPlayer] Video update:", data);
  videoStore.videoTimeupdate({ currentTime: data.currentTime });
});
</script>

<style lang="scss" scoped>
.playlist {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 0 0 0;
}

.alist-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.empty-queue {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 120px;
  .empty-icon {
    font-size: 24px;
    color: #b0b0b0;
  }
  .empty-text {
    margin-top: 8px;
    color: #b0b0b0;
    font-size: 16px;
  }
}

.queue-tree {
  border: 1px solid rgba(255, 255, 255, 0.16);
  margin: 8px 8px 0;
  height: 120px;
  overflow-y: scroll;
  border-radius: 8px;
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
.video-actions {
  position: relative;
  border-radius: 16px;
  margin: 0 auto;
}
.action-buttons {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}
.seekbar-container {
  position: relative;
  flex: 1 1 auto;
  padding: 0 16px;
}
.seekbar {
  width: 100%;
}
.duration {
  padding: 0 4px;
  position: absolute;
  right: 24px;
  top: 10px;
  min-width: 60px;
  font-size: 14px;
}
.list-actions {
  display: flex;
  justify-content: space-between;
  margin: 8px 8px 0;

  .clear-btn {
    font-weight: 500;
    color: #ff4d4f;
  }
}
</style>

<template>
  <div class="playlist">
    <el-alert
      v-if="videoError"
      class="video-error"
      type="error"
      :title="videoError"
      show-icon
      closable
      @close="videoStore.clearVideoError"
    />

    <div class="video-actions">
      <div class="action-buttons">
        <el-button class="prev-button" type="primary" circle :disabled="!canPlayPrevious" title="Previous" aria-label="Previous" @click="playPrevious">
          <Icon icon="mingcute:skip-previous-line" class="white-text" />
        </el-button>
        <el-button class="pause-button" v-if="isPlaying" type="primary" size="large" circle title="Pause" aria-label="Pause" @click="pause">
          <Icon icon="mingcute:pause-line" class="white-text" />
        </el-button>
        <el-button class="play-button" v-if="!isPlaying" type="primary" size="large" circle :disabled="!canPlay" title="Play" aria-label="Play" @click="resume">
          <Icon icon="mingcute:play-line" class="white-text" />
        </el-button>
        <el-button class="next-button" type="primary" circle :disabled="!canPlayNext" title="Next" aria-label="Next" @click="playNext">
          <Icon icon="mingcute:skip-forward-line" class="white-text" />
        </el-button>
      </div>

      <div class="seekbar-container">
        <el-slider class="seekbar" id="seekbar" :min="0" :max="100" :model-value="currentTime" @input="inputCurrentTime" show-tooltip />
      </div>
      <el-tag type="info" class="duration" size="small">{{ videoRemaining }}</el-tag>

      <div class="playback-tools">
        <el-button class="tool-button" size="small" :class="{ active: playbackMode !== 'sequence' }" :title="playbackModeLabel" :aria-label="playbackModeLabel" @click="cyclePlaybackMode">
          <Icon :icon="playbackModeIcon" />
        </el-button>

        <el-popover placement="bottom" width="220px" trigger="click" popper-class="volume-popover">
          <template #reference>
            <el-button class="tool-button" size="small" :class="{ active: muted || volume === 0 }" title="Volume" aria-label="Volume">
              <Icon :icon="volumeIcon" />
            </el-button>
          </template>
          <div class="volume-panel">
            <div class="volume-header">
              <span>Volume</span>
              <el-button class="mute-toggle" text size="small" @click="toggleMuted">
                {{ muted ? "Unmute" : "Mute" }}
              </el-button>
            </div>
            <el-slider :model-value="volumePercentage" :min="0" :max="100" @input="inputVolume" />
          </div>
        </el-popover>

        <el-select class="speed-select" size="small" :model-value="playbackRate" title="Playback speed" aria-label="Playback speed" @change="inputPlaybackRate">
          <el-option v-for="rate in playbackRates" :key="rate" :label="`${rate}x`" :value="rate" />
        </el-select>
      </div>
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
          <span class="truncate" :title="data.name">{{ data.name }}</span>
          <el-button plain size="small" class="playlist-deleter" text title="Remove" aria-label="Remove" @click.stop.prevent="removeByData(data)">
            <Icon icon="mingcute:close-line" />
          </el-button>
        </div>
      </template>
    </el-tree>

    <div class="list-actions">
      <div class="add-actions">
        <el-button type="primary" @click="openFileDialog" round size="small" class="add-video-btn" title="Add videos" aria-label="Add videos">
          <Icon icon="mingcute:add-line" />
        </el-button>
        <el-button @click="openFolderDialog" round size="small" title="Add folder" aria-label="Add folder">
          <Icon icon="mingcute:folder-open-line" />
        </el-button>
        <el-dropdown trigger="click" :disabled="!videoStore.hasRecentFiles" @command="handleRecentCommand">
          <el-button round size="small" :disabled="!videoStore.hasRecentFiles" title="Recent files" aria-label="Recent files">
            <Icon icon="mingcute:time-line" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="file in recentFiles" :key="file.path" :command="file">
                {{ file.name }}
              </el-dropdown-item>
              <el-dropdown-item divided command="clear">Clear recent</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <el-button v-show="!queueIsEmpty" class="clear-btn" @click="clear" size="small" round title="Clear playlist" aria-label="Clear playlist">
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

interface QueueItem {
  name: string;
  path: string;
}

type PlaybackMode = "sequence" | "repeat-all" | "repeat-one" | "shuffle";
type RecentCommand = QueueItem | "clear";

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
const playbackModeOrder: Array<PlaybackMode> = ["sequence", "repeat-all", "repeat-one", "shuffle"];
const playbackModeMeta: Record<PlaybackMode, { label: string; icon: string }> = {
  sequence: { label: "Sequence", icon: "mingcute:playlist-line" },
  "repeat-all": { label: "Repeat all", icon: "mingcute:repeat-line" },
  "repeat-one": { label: "Repeat one", icon: "mingcute:repeat-one-line" },
  shuffle: { label: "Shuffle", icon: "mingcute:shuffle-2-line" },
};

const videoStore = useVideoStore();
const settingsStore = useSettingsStore();

const queues = computed(() => videoStore.queues);
const recentFiles = computed(() => videoStore.recentFiles);
const playPointer = computed(() => videoStore.playPointer);
const queueIsEmpty = computed(() => queues.value.length === 0);
const video = computed(() => videoStore.video);
const videoError = computed(() => video.value.error);
const isPlaying = computed(() => video.value.isPlaying);
const playbackMode = computed(() => videoStore.playbackMode);
const playbackModeIcon = computed(() => playbackModeMeta[playbackMode.value].icon);
const playbackModeLabel = computed(() => playbackModeMeta[playbackMode.value].label);
const volume = computed(() => videoStore.volume);
const muted = computed(() => videoStore.muted);
const playbackRate = computed(() => videoStore.playbackRate);
const volumePercentage = computed(() => Math.round(volume.value * 100));
const volumeIcon = computed(() => {
  if (muted.value || volume.value === 0) return "mingcute:volume-mute-line";
  if (volume.value < 0.5) return "mingcute:volume-line";
  return "mingcute:volume-fill";
});
const videoRemaining = computed(() => {
  const remainSeconds = Math.max(0, Math.floor(video.value.duration - video.value.currentTime));
  return `${Math.floor(remainSeconds / 60)}:${("0" + (remainSeconds % 60)).slice(-2)}`;
});
const currentTime = computed(() => {
  const percentage = (video.value.currentTime / video.value.duration) * 100;
  return isNaN(percentage) ? 0 : percentage;
});

const treeData = computed(() => queues.value.map((q, i) => ({ ...q, id: i })));

const canPlay = computed(() => queues.value.length > 0);
const canPlayPrevious = computed(() => getPreviousIndex() !== null);
const canPlayNext = computed(() => getManualNextIndex() !== null);

function removeByData(data: { name: string; path: string; id: number }) {
  remove(data.id);
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

function play(index: number, options: { restorePosition?: boolean } = {}) {
  const file = queues.value[index];
  if (!file) {
    videoStore.setVideoError({ message: "Selected video is no longer available." });
    return;
  }

  videoStore.selectVideo({ index });
  videoStore.addRecentFiles([file]);
  ipc.commit(types.VIDEO_SELECT, { index });

  settingsStore.changeMode("video-player");
  ipc.commit(types.CHANGE_MODE, "video-player");

  const startTime = options.restorePosition === false ? 0 : videoStore.getPlaybackPosition(file.path);
  ipc.commit(types.PLAY_FILE, {
    file: {
      name: file.name,
      path: file.path || "",
    },
    startTime,
  });
  settingsStore.videoSelect();
}

function resume() {
  if (playPointer.value === null) {
    play(0);
    return;
  }

  if (!videoStore.currentFile) {
    play(playPointer.value);
    return;
  }

  ipc.commit(types.RESUME_FILE, {});
}

function pause() {
  ipc.commit(types.PAUSE_FILE, {});
}

function playPrevious() {
  const previousIndex = getPreviousIndex();
  if (previousIndex !== null) play(previousIndex);
}

function playNext() {
  const nextIndex = getManualNextIndex();
  if (nextIndex !== null) play(nextIndex);
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

function cyclePlaybackMode() {
  const currentIndex = playbackModeOrder.indexOf(playbackMode.value);
  const nextMode = playbackModeOrder[(currentIndex + 1) % playbackModeOrder.length];
  videoStore.setPlaybackMode(nextMode);
}

function inputVolume(value: number | number[]) {
  const nextValue = Array.isArray(value) ? value[0] : value;
  const nextVolume = nextValue / 100;
  videoStore.setVolume(nextVolume);
  ipc.commit(types.VIDEO_VOLUME, { volume: nextVolume });
}

function toggleMuted() {
  const nextMuted = !muted.value;
  videoStore.setMuted(nextMuted);
  ipc.commit(types.VIDEO_MUTED, { muted: nextMuted });
}

function inputPlaybackRate(rate: number) {
  videoStore.setPlaybackRate(rate);
  ipc.commit(types.VIDEO_PLAYBACK_RATE, { playbackRate: rate });
}

function addFilesToQueue(files: Array<QueueItem>) {
  if (files.length === 0) return;
  videoStore.addQueues(files);
}

async function openFileDialog() {
  try {
    const result = await ipc.showOpenDialog({
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Video Files", extensions: ["mp4", "webm", "mov", "avi", "mkv", "m4v", "3gp", "flv", "wmv"] }],
    });

    if (!result.canceled && result.filePaths) {
      addFilesToQueue(
        result.filePaths.map((filePath: string) => ({
          name: filePath.split("/").pop() || filePath.split("\\").pop() || "Unknown",
          path: filePath,
        })),
      );
    }
  } catch (error) {
    videoStore.setVideoError({ message: `Could not open files: ${String(error)}` });
  }
}

async function openFolderDialog() {
  try {
    const result = await ipc.showOpenDialog({
      properties: ["openDirectory"],
    });

    if (result.canceled || !result.filePaths?.[0]) return;

    const response = await ipc.invoke("list-video-files", {
      folderPath: result.filePaths[0],
      recursive: true,
    });

    if (!response.success) {
      videoStore.setVideoError({ message: response.error || "Could not read the selected folder." });
      return;
    }

    if (response.files.length === 0) {
      videoStore.setVideoError({ message: "No supported videos were found in the selected folder." });
      return;
    }

    addFilesToQueue(response.files);
    if (response.truncated) {
      videoStore.setVideoError({ message: "Only the first 500 supported videos were added from this folder." });
    }
  } catch (error) {
    videoStore.setVideoError({ message: `Could not add folder: ${String(error)}` });
  }
}

function handleRecentCommand(command: RecentCommand) {
  if (command === "clear") {
    videoStore.clearRecentFiles();
    return;
  }

  videoStore.addQueue(command);
}

function getShuffleIndex(currentIndex: number): number | null {
  if (queues.value.length === 0) return null;
  if (queues.value.length === 1) return currentIndex;

  const candidates = queues.value.map((_file, index) => index).filter((index) => index !== currentIndex);
  return candidates[Math.floor(Math.random() * candidates.length)] ?? null;
}

function getPreviousIndex(): number | null {
  const currentIndex = playPointer.value;
  if (currentIndex === null || queues.value.length === 0) return null;
  if (playbackMode.value === "shuffle") return getShuffleIndex(currentIndex);
  if (currentIndex > 0) return currentIndex - 1;
  if (playbackMode.value === "repeat-all" && queues.value.length > 1) return queues.value.length - 1;
  return null;
}

function getManualNextIndex(): number | null {
  const currentIndex = playPointer.value;
  if (currentIndex === null || queues.value.length === 0) return null;
  if (playbackMode.value === "shuffle") return getShuffleIndex(currentIndex);
  if (currentIndex + 1 < queues.value.length) return currentIndex + 1;
  if (playbackMode.value === "repeat-all" && queues.value.length > 1) return 0;
  return null;
}

function getNextAutoplayIndex(): number | null {
  const currentIndex = playPointer.value;
  if (currentIndex === null || queues.value.length === 0) return null;

  if (playbackMode.value === "repeat-one") return currentIndex;

  if (playbackMode.value === "shuffle") {
    return getShuffleIndex(currentIndex);
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex < queues.value.length) return nextIndex;

  return playbackMode.value === "repeat-all" ? 0 : null;
}

function playAfterEnded() {
  const nextIndex = getNextAutoplayIndex();
  if (nextIndex === null) return;

  play(nextIndex, { restorePosition: false });
}

ipc.on(types.CONNECT_COMMIT, (...args: unknown[]) => {
  const [typeName] = args as [string, string];
  if (typeName === types.VIDEO_ENDED) {
    playAfterEnded();
  }
});
</script>

<style lang="scss" scoped>
.playlist {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 10px 0 0 0;
}

.video-error {
  margin: 0 8px 8px;

  :deep(.el-alert__title) {
    display: block;
    max-width: 236px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.empty-queue {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 92px;
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
  height: 104px;
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
  border-radius: 8px;
  margin: 0 auto;
}
.action-buttons {
  padding: 6px 8px;
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
  top: 8px;
  min-width: 60px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
.playback-tools {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 8px 4px;
}
.tool-button {
  width: 32px;
  min-width: 32px;

  &.active {
    background-color: var(--el-color-primary);
    color: #ffffff;
  }
}
.speed-select {
  width: 82px;
}
.volume-panel {
  width: 100%;
}
.volume-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--el-text-color-primary);
  font-size: 13px;
}
.mute-toggle {
  min-height: 28px;
}
.list-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 8px 0;
}
.add-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}
.clear-btn {
  font-weight: 500;
  color: #ff4d4f;
}
</style>

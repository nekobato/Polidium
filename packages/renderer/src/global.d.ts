export {};

declare global {
  interface Window {
    // Expose some Api through preload script
    fs: typeof import('fs');
    ipc: {
      send: (event: string, payload?: any) => void;
      on: (
        event: string,
        callback: (event: IpcRendererEvent, ...args: any[]) => void
      ) => void;
    };
    removeLoading: () => void;
  }
}

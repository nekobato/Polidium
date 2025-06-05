export interface ElectronAPI {
  send(channel: string, ...args: unknown[]): void
  on(channel: string, listener: (...args: unknown[]) => void): void
  invoke(channel: string, ...args: unknown[]): Promise<unknown>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
export {}

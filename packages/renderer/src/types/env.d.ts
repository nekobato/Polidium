/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // その他の環境変数...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_PLAUSIBLE_SCRIPT_SRC?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

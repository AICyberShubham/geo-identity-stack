import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import type { Plugin } from "vite";

// The TanStack devtools source-injection plugin adds a `data-tsd-source` attribute to every
// JSX element. React Three Fiber elements (<mesh>, <group>, ...) are not DOM nodes, so R3F
// throws "Cannot set data-tsd-source". Strip that plugin in dev.
const disableDevtoolsSourceInjection = (): Plugin => ({
  name: "disable-devtools-source-injection",
  enforce: "pre",
  configResolved(config) {
    const plugins = config.plugins as Plugin[];
    for (let i = plugins.length - 1; i >= 0; i--) {
      const name = plugins[i]?.name ?? "";
      if (name.includes("devtools")) plugins.splice(i, 1);
    }
  },
});

export default defineConfig({
  plugins: [
    tanstackStart({ server: { entry: "server" } }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    disableDevtoolsSourceInjection(),
  ],
});

// Vite and TanStack Start build configuration with Cloudflare Nitro target,
// Tailwind CSS v4, path aliases, and React 19 support.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
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
  vite: {
    plugins: [disableDevtoolsSourceInjection()],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

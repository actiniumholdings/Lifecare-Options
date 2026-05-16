import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    // Exclude active git worktrees so vitest doesn't double-discover the
    // same test files (each worktree has its own node_modules with a
    // separate React copy, which breaks under duplicate discovery).
    exclude: ["**/node_modules/**", "**/.worktrees/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});

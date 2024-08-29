import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // global use of vitest commands
    setupFiles: ['tests/setups.ts'],
  }
})
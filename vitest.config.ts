import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    outputFile: './test-report.junit.xml',
    reporters: ['junit'],
    coverage: {
      reporter: ['cobertura'],
    },
  },
})

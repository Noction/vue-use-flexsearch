import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: 'src',
    outputFile: './test-report.junit.xml',
    reporters: ['junit', 'verbose'],
    coverage: {
      exclude: [
        ...configDefaults.exclude,
      ],
      reporter: ['cobertura', 'text'],
    },
  },
})

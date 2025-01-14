import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'dist',
      'coverage',
      '*rc.js',
      '*.json',
      '*.yaml',
      '*.md',
    ],
    rules: {
      'ts/no-explicit-any': 'error',
      'ts/consistent-type-definitions': ['error', 'type'],
      'unused-imports/no-unused-vars': ['error', {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase', { registeredComponentsOnly: false }],
    },
  },
)

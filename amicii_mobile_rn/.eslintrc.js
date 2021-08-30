module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    '@react-native-community',
    'prettier',
    'plugin:json/recommended-with-comments',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-native',
    'react-hooks',
    'prettier',
    'sort-keys-fix',
    'simple-import-sort',
  ],
  rules: {
	'prettier/prettier': 0,
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.tsx'],
      },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'import/named': 'off',
    'import/no-named-as-default': 'off',
    'no-undef': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-children-prop': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-unused-styles': 'error',
    'jest/valid-expect-in-promise': 'off',
    'jest/valid-expect': ['error', {alwaysAwait: true}],
    'jest/consistent-test-it': ['error', {fn: 'test'}],
    'jest/no-large-snapshots': 'error',
    'jest/no-test-return-statement': 'error',
    'jest/prefer-spy-on': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
    // It is workaround to disable errors of eslint not finding dependencies for React Native
    // https://stackoverflow.com/questions/60973737/eslint-does-not-find-react-native-components
    'import/ignore': ['react-native'],
    // Used to align eslint for 'eslint-plugin-react'
    // https://github.com/yannickcr/eslint-plugin-react/pull/1978/files
    react: {
      version: 'detect',
    },
  },
}

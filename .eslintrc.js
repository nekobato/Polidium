module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/standard', '@vue/typescript', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: ['error', 'always'],
    'no-extra-semi': 'error',
    'space-before-function-paren': ['error', 'never'],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: ['prettier'],
};

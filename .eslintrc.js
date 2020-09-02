module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    '@vue/typescript/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/essential',
    'prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint', 'prettier'],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};

module.exports = {
    root: true,
    env: {
        es2021: true,
    },
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        ecmaVersion: 12,
        sourceType: 'module',
    },
    ignorePatterns: ['dist/'],
    plugins: [
        'import',
        '@typescript-eslint'
    ],
    rules: {
    },
};

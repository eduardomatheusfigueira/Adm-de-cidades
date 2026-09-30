// Lint focado em erros reais (variáveis não definidas, hooks) — não em estilo.
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: '18.2' } },
  plugins: ['react', 'react-hooks'],
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'no-undef': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'no-unused-vars': 'off',
    'no-empty': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations': 'off',
    'react/display-name': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/', 'public/', 'docs/', '*.ts', 'old_*.jsx', 'original_*.jsx', 'temp_*.jsx'],
};

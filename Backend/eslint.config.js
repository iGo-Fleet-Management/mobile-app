const eslintPluginPrettier = require('eslint-plugin-prettier');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        node: true,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier, // Plugin do Prettier
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'lf' // Força estilo Unix
        }
      ]
    }
  },
  eslintConfigPrettier, // Desativa regras do ESLint que conflitam com o Prettier
];

import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        node: true,
      },
    },
    plugins: {
      prettier: eslintPluginPrettier, // Plugin do Prettier
    },
    rules: {
      // Regras personalizadas (opcional)
      'prettier/prettier': 'error', // Habilita o Prettier como regra do ESLint
    },
  },
  eslintConfigPrettier, // Desativa regras do ESLint que conflitam com o Prettier
];
// eslint.config.js - Versión mejorada con reglas de seguridad
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginSecurity from 'eslint-plugin-security'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      'plugin:security/recommended', // ✅ Agregar reglas de seguridad
    ],
    plugins: {
      security: eslintPluginSecurity,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // ✅ Reglas de seguridad adicionales
      'react/no-danger': 'error', // Prohibir dangerouslySetInnerHTML sin justificación
      'react/no-danger-with-children': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Deshabilitar console.log en producción
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
    },
  },
  {
    files: ['**/ui/SafeHTML.jsx', '**/ui/SafeText.jsx', '**/Hooks/useSanitize.js'],
    rules: {
      'react/no-danger': 'off', // Solo desactivado en componentes que manejan sanitización
      'react/no-danger-with-children': 'off',
    }
  }
])
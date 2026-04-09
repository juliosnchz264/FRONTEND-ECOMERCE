// eslint.config.safe.js - Configuración específica para componentes seguros
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/ui/SafeHTML.jsx', '**/ui/SafeText.jsx', '**/Hooks/useSanitize.js'],
    rules: {
      'react/no-danger': 'off',
      'react/no-danger-with-children': 'off',
      'no-unused-vars': 'off',
    }
  }
])
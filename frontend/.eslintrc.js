module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // Disable exhaustive-deps warnings for legacy code
    // These are intentional in many cases for performance
    'react-hooks/exhaustive-deps': 'off',
    // Allow unused vars with underscore prefix
    'no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }]
  }
};

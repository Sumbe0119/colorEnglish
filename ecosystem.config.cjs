// ecosystem.config.cjs — PM2 (repo root: /var/www/colorEnglish)
// npm wrapper хэрэглэхгүй — monorepo-д args буруу parse хийгддэг
module.exports = {
  apps: [
    {
      name: 'color-backend',
      cwd: '/var/www/colorEnglish/backend',
      script: 'dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'color-frontend',
      cwd: '/var/www/colorEnglish/frontend',
      // workspace: next root node_modules-д байна
      script: '/var/www/colorEnglish/node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
    },
  ],
};

// ecosystem.config.cjs — PM2 (repo root: /var/www/colorEnglish)
module.exports = {
  apps: [
    {
      name: 'color-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'color-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

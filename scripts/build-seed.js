// scripts/build-seed.js
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/server/db/seed.ts'],
  bundle: true,
  platform: 'node',
  target: 'node14', // or your Node.js version
  outfile: 'dist/seed.js', // Path where the compiled JS will be saved
  sourcemap: true, // Optional: generate a source map
  loader: {
    '.ts': 'ts',
  },
  external: ['@prisma/client'], // If you have any external dependencies
}).catch(() => process.exit(1));


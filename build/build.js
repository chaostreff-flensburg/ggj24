import esbuildPluginTsc from 'esbuild-plugin-tsc';
import * as esbuild from 'esbuild';

function createBuildSettings(options) {
  return {
    entryPoints: ['src/main.ts'],
    outfile: 'dist/bundle.js',
    bundle: true,
    plugins: [
      esbuildPluginTsc({
        force: true
      }),
    ],
    ...options
  };
}

const settings = createBuildSettings({ minify: true });

await esbuild.build(settings);
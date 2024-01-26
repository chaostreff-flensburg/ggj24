import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { copy } from 'esbuild-plugin-copy';

export function createBuildSettings(options) {
  return {
    entryPoints: ['src/main.ts'],
    outfile: 'dist/bundle.js',
    bundle: true,
    plugins: [
      esbuildPluginTsc({
        force: true
      }),
      copy({
        // this is equal to process.cwd(), which means we use cwd path as base path to resolve `to` path
        // if not specified, this plugin uses ESBuild.build outdir/outfile options as base path.
        resolveFrom: 'cwd',
        assets: {
          from: ['./src/assets/*'],
          to: ['./dist'],
        },
        watch: true,
      }),
    ],
    ...options
  };
}
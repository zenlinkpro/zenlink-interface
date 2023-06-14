import { exec } from 'node:child_process'
import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: {
    index: './src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: false,
  treeshake: true,
  splitting: true,
  clean: !options.watch,
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly --declaration', (err) => {
      if (err) {
        console.error(err)
        if (!options.watch)
          process.exit(1)
      }
    })
  },
}))

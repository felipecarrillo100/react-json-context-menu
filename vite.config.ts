import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        lib: {
            entry: 'src/index.tsx',
            name: 'ReactJsonContextMenu',
            fileName: (format) => `react-json-context-menu.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react-contexify'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react-contexify': 'ReactContexify',
                },
            },
        },
    },
});

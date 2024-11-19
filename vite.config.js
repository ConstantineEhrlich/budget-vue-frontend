import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const isLocal = mode === 'development';

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: isLocal ? {
            host: 'mybudget-test.home.arpa',
            https: {
                key: fs.readFileSync('./.certs/mybudget_Key.pem'),
                cert: fs.readFileSync('./.certs/mybudget_Cert.pem'),
            }
        } : null,
    }
})
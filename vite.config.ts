import { defineConfig } from 'vite'

const base = process.env.BASE ?? '/'

export default defineConfig({
    base,
})

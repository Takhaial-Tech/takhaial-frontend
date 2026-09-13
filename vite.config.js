import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {fileURLToPath} from 'node:url';
import {createLocalAdminPlugin} from './scripts/local-admin.mjs';

// The local studio is a development convenience and is never part of a public
// build. VITE_PUBLIC_PREVIEW=true is what production sets.
const PUBLIC = process.env.VITE_PUBLIC_PREVIEW === 'true';

export default defineConfig({
  plugins: [
    ...(PUBLIC ? [] : [createLocalAdminPlugin(fileURLToPath(new URL('.',import.meta.url)))]),
    react(),
    tailwindcss(),
  ],
});

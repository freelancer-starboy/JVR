/** @type {import('next').NextConfig} */
const nextConfig = {
    // Lets a verification build run without touching the dev server's .next folder (NEXT_DIST_DIR=.next-verify)
    distDir: process.env.NEXT_DIST_DIR || ".next",
}

module.exports = nextConfig

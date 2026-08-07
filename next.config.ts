import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  // Next writes its own AGENTS.md / CLAUDE.md on dev start. Ackto already puts
  // this project's conventions in AI_RULES.md, and two competing rule files in
  // one app is how an agent follows the wrong one.
  agentRules: false,
  turbopack: {
    root: path.resolve(dirname),
    // Dev only: the tagger stamps data-ackto-id on every JSX element so
    // Ackto's preview can map a clicked element back to its source.
    rules:
      process.env.NODE_ENV === 'development'
        ? {
            '*.{jsx,tsx}': {
              loaders: ['./tools/ackto-tagger-loader.mjs'],
            },
          }
        : {},
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })

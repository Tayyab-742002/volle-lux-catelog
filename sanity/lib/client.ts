import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Disable CDN in production to ensure fresh data
  // CDN caching can prevent updates from appearing immediately
  useCdn: process.env.NODE_ENV === 'development',
  // Add perspective for draft content in development
  perspective: process.env.NODE_ENV === 'development' ? 'previewDrafts' : 'published',
})

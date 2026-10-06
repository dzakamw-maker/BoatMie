import '@testing-library/jest-dom'
import { fetch, Headers, Request, Response } from 'undici'

// Polyfill fetch for node environment (used by Firebase)
globalThis.fetch = fetch as any
globalThis.Headers = Headers as any
globalThis.Request = Request as any
globalThis.Response = Response as any

// Mock next/env environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = "test-api-key"
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = "test-domain"
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "test-project"
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = "test-bucket"
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "test-sender"
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = "test-app-id"

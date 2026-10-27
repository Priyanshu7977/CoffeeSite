/**
 * Vercel Serverless Catch-All API Handler
 * Captures all /api/* routes and passes them to the Express application.
 */

import { app } from '../src/server/app';

export default function handler(req: any, res: any) {
  return app(req, res);
}


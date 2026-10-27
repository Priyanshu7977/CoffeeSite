/**
 * Vercel Serverless Function Entry Point
 * Routes /api requests to the Express application.
 */

import { app } from '../src/server/app';

export default function handler(req: any, res: any) {
  return app(req, res);
}


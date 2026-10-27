/**
 * Serverless API Entry Point for Vercel
 * Wraps Express application for Vercel Serverless Function execution.
 */

import { app } from './app';

export default function handler(req: any, res: any) {
  return app(req, res);
}

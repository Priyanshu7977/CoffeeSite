/**
 * Standalone Node.js / Express Server Runner
 * Useful for local testing, Docker, and non-serverless deployments.
 */

import { app } from './app';

const PORT = process.env.PORT || 5000;

export const server = app.listen(PORT, () => {
  console.log(`☕ Noir Dakshin Coffee Payment Server running at http://localhost:${PORT}`);
  console.log(`🔒 Razorpay Gateway & Webhook verification active.`);
});

export default server;

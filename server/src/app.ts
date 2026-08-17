import express from 'express';
import { createLineOaModule } from '../../modules/line-oa-ai-module/src/index.js';

export function createApp(config: {
  channelAccessToken: string;
  channelSecret: string;
}): express.Express {
  const lineOaHandler = createLineOaModule(config);
  const app = express();

  app.post('/webhook/line', express.raw({ type: '*/*' }), async (req, res) => {
    const signatureHeader = req.headers['x-line-signature'];
    const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;
    const result = await lineOaHandler.handleWebhook(req.body, signature);

    if (!result.verification.isValid) {
      return res.status(401).json({ error: result.verification.reason });
    }

    return res.status(200).json({
      status: 'OK',
      processed: result.eventsProcessed.length,
    });
  });

  app.get('/health', (_req, res) => res.json({ ok: true }));

  return app;
}

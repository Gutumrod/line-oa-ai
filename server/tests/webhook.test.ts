import { createHmac } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';

const testConfig = {
  channelAccessToken: 'test-token',
  channelSecret: 'test-secret',
};

describe('LINE webhook server', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp(testConfig);

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  });

  function signBody(bodyString: string): string {
    return createHmac('sha256', testConfig.channelSecret)
      .update(bodyString)
      .digest('base64');
  }

  it('accepts a valid webhook signature', async () => {
    const bodyString = JSON.stringify({ events: [] });
    const response = await fetch(`${baseUrl}/webhook/line`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-line-signature': signBody(bodyString),
      },
      body: bodyString,
    });

    await expect(response.json()).resolves.toEqual({
      status: 'OK',
      processed: 0,
    });
    expect(response.status).toBe(200);
  });

  it('rejects an invalid webhook signature', async () => {
    const bodyString = JSON.stringify({ events: [] });
    const response = await fetch(`${baseUrl}/webhook/line`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-line-signature': 'bad-signature',
      },
      body: bodyString,
    });

    expect(response.status).toBe(401);
  });

  it('returns health status', async () => {
    const response = await fetch(`${baseUrl}/health`);

    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(response.status).toBe(200);
  });
});

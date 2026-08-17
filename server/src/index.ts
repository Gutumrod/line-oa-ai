import { createApp } from './app.js';
import { loadConfigFromEnv } from './config.js';

const config = loadConfigFromEnv();
const app = createApp(config);

app.listen(config.port, () => {
  console.log(`line-oa-ai server listening on :${config.port}`);
});

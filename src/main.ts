import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { isDevMode } from '@angular/core';

async function bootstrap() {
  if (isDevMode()) {
    const { worker } = await import('./app/mocks/browser');
    await worker.start({ onUnhandledRequest: 'warn' });
  }
  await bootstrapApplication(App, appConfig);
}

bootstrap().catch((err) => console.error(err));

import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import CustomPreset from '../src/app/design-system/tokens/preset';

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        providePrimeNG({
          theme: {
            preset: CustomPreset,
            options: { darkModeSelector: '.dark-mode' },
          },
        }),
      ],
    }),
  ],
};

export default preview;

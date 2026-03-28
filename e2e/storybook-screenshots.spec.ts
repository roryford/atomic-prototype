import { test } from '@playwright/test';

/**
 * Captures isolated screenshots of every design-system component from Storybook.
 * Run: npm run screenshots:components
 * Requires Storybook running on :6006 (started automatically via webServer).
 * Output: docs/screenshots/components/
 */

const STORYBOOK = 'http://localhost:6006';

// Each entry: [category, component, storyId, filename]
const stories: [string, string, string, string][] = [
  // Atoms
  ['atoms', 'Button', 'design-system-atoms-button--primary', 'button-primary'],
  ['atoms', 'Button', 'design-system-atoms-button--secondary', 'button-secondary'],
  ['atoms', 'Button', 'design-system-atoms-button--danger', 'button-danger'],
  ['atoms', 'Button', 'design-system-atoms-button--outlined', 'button-outlined'],
  ['atoms', 'Tag', 'design-system-atoms-tag--success', 'tag-success'],
  ['atoms', 'Tag', 'design-system-atoms-tag--warning', 'tag-warning'],
  ['atoms', 'Tag', 'design-system-atoms-tag--danger', 'tag-danger'],
  ['atoms', 'Tag', 'design-system-atoms-tag--info', 'tag-info'],
  ['atoms', 'Input', 'design-system-atoms-input--default', 'input-default'],
  ['atoms', 'Input', 'design-system-atoms-input--with-placeholder', 'input-placeholder'],
  [
    'atoms',
    'EmptyState',
    'design-system-atoms-emptystate--default',
    'empty-state-default',
  ],
  [
    'atoms',
    'EmptyState',
    'design-system-atoms-emptystate--with-action',
    'empty-state-action',
  ],

  // Molecules
  [
    'molecules',
    'StatCard',
    'design-system-molecules-statcard--default',
    'stat-card-default',
  ],
  [
    'molecules',
    'SearchBar',
    'design-system-molecules-searchbar--default',
    'search-bar-default',
  ],
  [
    'molecules',
    'FormField',
    'design-system-molecules-formfield--default',
    'form-field-default',
  ],
  [
    'molecules',
    'FormField',
    'design-system-molecules-formfield--full-width',
    'form-field-full-width',
  ],

  // Organisms — all states
  [
    'organisms',
    'StatGrid',
    'design-system-organisms-statgrid--loading',
    'stat-grid-loading',
  ],
  [
    'organisms',
    'StatGrid',
    'design-system-organisms-statgrid--error',
    'stat-grid-error',
  ],
  [
    'organisms',
    'StatGrid',
    'design-system-organisms-statgrid--empty',
    'stat-grid-empty',
  ],
  [
    'organisms',
    'StatGrid',
    'design-system-organisms-statgrid--with-data',
    'stat-grid-data',
  ],
  [
    'organisms',
    'ProjectCardGrid',
    'design-system-organisms-projectcardgrid--loading',
    'card-grid-loading',
  ],
  [
    'organisms',
    'ProjectCardGrid',
    'design-system-organisms-projectcardgrid--error',
    'card-grid-error',
  ],
  [
    'organisms',
    'ProjectCardGrid',
    'design-system-organisms-projectcardgrid--empty',
    'card-grid-empty',
  ],
  [
    'organisms',
    'ProjectCardGrid',
    'design-system-organisms-projectcardgrid--with-data',
    'card-grid-data',
  ],
  [
    'organisms',
    'ProjectTable',
    'design-system-organisms-projecttable--loading',
    'table-loading',
  ],
  [
    'organisms',
    'ProjectTable',
    'design-system-organisms-projecttable--error',
    'table-error',
  ],
  [
    'organisms',
    'ProjectTable',
    'design-system-organisms-projecttable--empty',
    'table-empty',
  ],
  [
    'organisms',
    'ProjectTable',
    'design-system-organisms-projecttable--with-data',
    'table-data',
  ],
  [
    'organisms',
    'ProjectTable',
    'design-system-organisms-projecttable--search-no-results',
    'table-no-results',
  ],
];

for (const [category, component, storyId, filename] of stories) {
  test(`${category}/${component}: ${filename}`, async ({ page }) => {
    // Use iframe URL for clean component-only rendering (no Storybook chrome)
    await page.goto(
      `${STORYBOOK}/iframe.html?id=${storyId}&viewMode=story`,
    );
    // Wait for Storybook to render the component (domcontentloaded + settle time)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: `docs/screenshots/components/${category}/${filename}.png`,
      fullPage: true,
    });
  });
}

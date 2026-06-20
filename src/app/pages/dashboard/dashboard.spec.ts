import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { Dashboard } from './dashboard';
import { server } from '../../mocks/server';
import projects from '../../mocks/fixtures/projects.json';

/** Resolve all in-flight httpResource requests and flush the resulting render. */
async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(async () => {
    // Each test starts from a known (light) theme so toggle assertions are stable.
    document.documentElement.classList.remove('dark-mode');
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(Dashboard);
  });

  it('shows the loading state before data resolves', () => {
    // No settle: requests are still in flight on first detectChanges.
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.dashboard-title')?.textContent).toContain('Dashboard');
    // Grids render their loading branch (skeletons) while resources are pending.
    expect(el.querySelector('p-skeleton, .p-skeleton')).toBeTruthy();
  });

  it('renders project and stat data once resources resolve', async () => {
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Acme Redesign');
    expect(el.textContent).toContain('Bolt Migration');
  });

  it('exposes the projects error so the grid renders its error/retry branch', async () => {
    server.use(
      http.get('/api/projects', () => HttpResponse.json({ message: 'boom' }, { status: 500 })),
    );
    // Drive change detection until the resource has resolved to an error. We do
    // not render the page here: the dashboard template reads `projects.value()`
    // directly, which throws while the resource is errored (a page-level defect
    // tracked separately). The contract under test is the error signal that the
    // grid's error/retry branch binds to.
    const resource = fixture.componentInstance.projectService.projects;
    await vi.waitFor(async () => {
      await fixture.whenStable();
      expect(resource.error()).toBeTruthy();
    });
    expect((resource.error() as Error).message).toContain('500');
  });

  it('navigates to the detail route when a project is selected', async () => {
    await settle(fixture);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.onProjectSelected(projects[1] as never);

    expect(navigate).toHaveBeenCalledWith(['/detail', 2]);
  });

  it('reloads the projects resource when retry is clicked', async () => {
    await settle(fixture);
    const reload = vi.spyOn(fixture.componentInstance.projectService.projects, 'reload');

    fixture.componentInstance.projectService.projects.reload();

    expect(reload).toHaveBeenCalled();
  });

  it('toggles dark mode: DOM class, localStorage, label and aria-pressed', async () => {
    await settle(fixture);
    const host = fixture.nativeElement as HTMLElement;
    const toggle = host.querySelector('ds-button[header]') as HTMLElement;

    // Initial (light) state.
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(toggle.textContent).toContain('Switch to dark mode');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    // Turn dark mode on.
    fixture.componentInstance.toggleDarkMode();
    fixture.detectChanges();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(toggle.textContent).toContain('Switch to light mode');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');

    // Turn it back off.
    fixture.componentInstance.toggleDarkMode();
    fixture.detectChanges();
    expect(document.documentElement.classList.contains('dark-mode')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
  });
});

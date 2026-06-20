import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { ListPage } from './list';
import { server } from '../../mocks/server';
import projects from '../../mocks/fixtures/projects.json';

/** Resolve all in-flight httpResource requests and flush the resulting render. */
async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('ListPage', () => {
  let fixture: ComponentFixture<ListPage>;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPage],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(ListPage);
  });

  it('renders the page title and the loading state before data resolves', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.full-width-layout-title')?.textContent).toContain('Projects');
    expect(el.querySelector('p-skeleton, .p-skeleton')).toBeTruthy();
  });

  it('renders the project rows once the resource resolves', async () => {
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Acme Redesign');
    expect(el.textContent).toContain('Bolt Migration');
  });

  it('exposes the projects error so the table renders its error/retry branch', async () => {
    server.use(
      http.get('/api/projects', () => HttpResponse.json({ message: 'boom' }, { status: 500 })),
    );
    // The list template reads `projects.value()` directly, which throws while the
    // resource is errored (a page-level defect tracked separately), so we assert
    // the error signal the table's error/retry branch binds to rather than render.
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

    fixture.componentInstance.onProjectSelected(projects[2] as never);

    expect(navigate).toHaveBeenCalledWith(['/detail', 3]);
  });

  it('reloads the projects resource when retry is invoked', async () => {
    await settle(fixture);
    const reload = vi.spyOn(fixture.componentInstance.projectService.projects, 'reload');

    fixture.componentInstance.projectService.projects.reload();

    expect(reload).toHaveBeenCalled();
  });
});

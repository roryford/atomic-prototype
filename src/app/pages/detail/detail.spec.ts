import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { Detail } from './detail';
import { server } from '../../mocks/server';

/** Resolve all in-flight httpResource requests and flush the resulting render. */
async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
}

function createDetail(id: string): ComponentFixture<Detail> {
  const fixture = TestBed.createComponent(Detail);
  // Mirrors withComponentInputBinding() binding the `:id` route param.
  fixture.componentRef.setInput('id', id);
  return fixture;
}

describe('Detail', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detail],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('shows the loading skeleton before the resource resolves', () => {
    const fixture = createDetail('1');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('p-skeleton, .p-skeleton')).toBeTruthy();
    // Data card is not rendered yet.
    expect(el.querySelector('ds-project-detail-card')).toBeNull();
  });

  it('renders the correct project for the bound route id', async () => {
    const fixture = createDetail('1');
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ds-project-detail-card')).toBeTruthy();
    expect(el.querySelector('h1')?.textContent).toContain('Acme Redesign');
    // Display fields are read-only inputs; the owner is bound to the value prop.
    const owner = Array.from(el.querySelectorAll('input')).find((i) => i.id === 'field-owner');
    expect(owner?.value).toBe('Alex Morgan');
  });

  it('re-fetches and re-renders when the route id changes (/detail/1 -> /detail/2)', async () => {
    const fixture = createDetail('1');
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Acme Redesign');

    // Simulate navigating to /detail/2: the bound input changes.
    fixture.componentRef.setInput('id', '2');
    await settle(fixture);

    expect(el.querySelector('h1')?.textContent).toContain('Bolt Migration');
    expect(el.querySelector('h1')?.textContent).not.toContain('Acme Redesign');
  });

  it('renders the error branch when the project does not exist', async () => {
    const fixture = createDetail('999');
    await settle(fixture);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('ds-project-detail-card')).toBeNull();
    expect(el.textContent).toContain('Project not found');
  });

  it('navigates back to the list when goBack is invoked', async () => {
    const fixture = createDetail('1');
    await settle(fixture);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture.componentInstance.goBack();

    expect(navigate).toHaveBeenCalledWith(['/list']);
  });

  it('navigates back to the list when the detail card emits backClicked', async () => {
    const fixture = createDetail('1');
    await settle(fixture);
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const card = fixture.debugElement.nativeElement.querySelector('ds-project-detail-card');
    expect(card).toBeTruthy();
    const backBtn = Array.from(card.querySelectorAll('button')).find((b) =>
      /back to list/i.test((b as HTMLElement).textContent ?? ''),
    ) as HTMLButtonElement | undefined;
    expect(backBtn).toBeTruthy();
    backBtn!.click();

    expect(navigate).toHaveBeenCalledWith(['/list']);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsProjectDetailCardSkeleton } from './project-detail-card-skeleton';

describe('DsProjectDetailCardSkeleton', () => {
  let fixture: ComponentFixture<DsProjectDetailCardSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsProjectDetailCardSkeleton],
    }).compileComponents();
    fixture = TestBed.createComponent(DsProjectDetailCardSkeleton);
  });

  // AC: GIVEN rendered, THEN the full skeleton scaffold (header + grid) appears
  it('should render the skeleton placeholders for the card layout', () => {
    fixture.detectChanges();
    const skeletons = fixture.nativeElement.querySelectorAll('.p-skeleton');
    // 3 in the header + (4 + 1) fields × 2 = 13 placeholders.
    expect(skeletons.length).toBe(13);
    expect(fixture.nativeElement.querySelector('.p-divider')).toBeTruthy();
  });

  // AC: GIVEN this is a loading placeholder, THEN it renders no real project data
  it('should not render any real project content', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')).toBeNull();
    expect(el.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});

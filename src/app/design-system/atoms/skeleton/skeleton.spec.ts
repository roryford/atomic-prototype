import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsSkeleton } from './skeleton';

describe('DsSkeleton', () => {
  let fixture: ComponentFixture<DsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsSkeleton],
    }).compileComponents();
    fixture = TestBed.createComponent(DsSkeleton);
  });

  // AC: GIVEN default inputs, WHEN rendered, THEN a skeleton element appears
  it('should render a skeleton element', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.p-skeleton')).toBeTruthy();
  });

  // AC: GIVEN width and height, WHEN rendered, THEN they are applied to the element
  it('should apply the provided width and height', () => {
    fixture.componentRef.setInput('width', '200px');
    fixture.componentRef.setInput('height', '28px');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.p-skeleton');
    expect(el.style.width).toBe('200px');
    expect(el.style.height).toBe('28px');
  });

  // AC: GIVEN shape="circle" and size, WHEN rendered, THEN size drives the dimensions
  it('should let size drive the dimensions for a circle', () => {
    fixture.componentRef.setInput('shape', 'circle');
    fixture.componentRef.setInput('size', '4rem');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.p-skeleton');
    expect(el.style.width).toBe('4rem');
    expect(el.style.height).toBe('4rem');
  });
});

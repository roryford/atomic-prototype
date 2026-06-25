import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsDivider } from './divider';

describe('DsDivider', () => {
  let fixture: ComponentFixture<DsDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsDivider],
    }).compileComponents();
    fixture = TestBed.createComponent(DsDivider);
  });

  // AC: GIVEN default inputs, WHEN rendered, THEN a horizontal divider appears
  it('should render a horizontal divider by default', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.p-divider');
    expect(el).toBeTruthy();
    expect(el.className).toContain('p-divider-horizontal');
  });

  // AC: GIVEN layout="vertical", WHEN rendered, THEN a vertical divider appears
  it('should switch to a vertical layout', () => {
    fixture.componentRef.setInput('layout', 'vertical');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.p-divider');
    expect(el.className).toContain('p-divider-vertical');
  });

  // AC: GIVEN type="dashed", WHEN rendered, THEN the dashed type is reflected
  it('should reflect the dashed type', () => {
    fixture.componentRef.setInput('type', 'dashed');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('.p-divider');
    expect(el.className).toContain('p-divider-dashed');
  });
});

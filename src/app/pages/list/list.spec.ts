import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ListPage } from './list';

describe('ListPage', () => {
  let fixture: ComponentFixture<ListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPage],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(ListPage);
  });

  it('should render without error', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('.full-width-layout')).toBeTruthy();
    expect(el.querySelector('.full-width-layout-title').textContent).toContain('Projects');
  });
});

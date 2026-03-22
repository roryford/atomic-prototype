import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
    fixture = TestBed.createComponent(Dashboard);
  });

  it('should render without error', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('.dashboard')).toBeTruthy();
    expect(el.querySelector('.dashboard-title').textContent).toContain('Dashboard');
  });
});

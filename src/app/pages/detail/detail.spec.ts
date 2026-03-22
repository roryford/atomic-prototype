import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Detail } from './detail';

describe('Detail', () => {
  let fixture: ComponentFixture<Detail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null),
              },
            },
          },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(Detail);
  });

  it('should render without error', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('.detail-page')).toBeTruthy();
  });
});

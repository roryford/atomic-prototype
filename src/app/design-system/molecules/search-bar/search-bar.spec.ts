import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DsSearchBar } from './search-bar';
import { DsButton } from '../../atoms';

describe('DsSearchBar', () => {
  let fixture: ComponentFixture<DsSearchBar>;
  let component: DsSearchBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsSearchBar],
    }).compileComponents();
    fixture = TestBed.createComponent(DsSearchBar);
    component = fixture.componentInstance;
  });

  // AC: GIVEN placeholder, WHEN rendered, THEN input shows placeholder
  it('should render with placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Find projects...');
    fixture.detectChanges();
    expect(component.placeholder()).toBe('Find projects...');
  });

  // PrimeNG's p-button (onClick) doesn't fire via DOM click dispatch in jsdom,
  // so we trigger the rendered ds-button's `clicked` output directly to exercise
  // the real (clicked)="searched.emit(value())" template binding.
  it('should emit searched when the search button is clicked', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.searched.subscribe(spy);

    // Type a real value into the rendered input.
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Alpha';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Click the rendered ds-button via its `clicked` output (its onClick handler).
    const button = fixture.debugElement.query(By.directive(DsButton));
    button.componentInstance.clicked.emit();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Alpha');
  });

  // AC: GIVEN user types "Alpha", WHEN Enter pressed, THEN emits searched with "Alpha"
  it('should emit searched on Enter keydown', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.searched.subscribe(spy);

    // Type a real value into the rendered input.
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Alpha';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const searchBar = fixture.nativeElement.querySelector('.search-bar');
    searchBar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Alpha');
  });
});

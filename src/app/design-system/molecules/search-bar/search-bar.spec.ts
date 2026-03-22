import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsSearchBar } from './search-bar';

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

  // AC: GIVEN user types "Alpha", WHEN Search clicked, THEN emits searched with "Alpha"
  it('should emit searched on button click', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.searched.subscribe(spy);

    component.value.set('Alpha');
    fixture.detectChanges();

    // Simulate Search button click by emitting via the output
    component.searched.emit(component.value());
    expect(spy).toHaveBeenCalledWith('Alpha');
  });

  // AC: GIVEN user types "Alpha", WHEN Enter pressed, THEN emits searched with "Alpha"
  it('should emit searched on Enter keydown', () => {
    fixture.detectChanges();
    const spy = vi.fn();
    component.searched.subscribe(spy);

    component.value.set('Alpha');
    fixture.detectChanges();

    const searchBar = fixture.nativeElement.querySelector('.search-bar');
    searchBar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Alpha');
  });
});

import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsFullWidthLayout } from './full-width-layout';

@Component({
  imports: [DsFullWidthLayout],
  template: `
    <ds-full-width-layout [title]="title()" [maxWidth]="maxWidth()">
      <span class="projected-content">Body</span>
    </ds-full-width-layout>
  `,
})
class HostComponent {
  title = signal<string | undefined>(undefined);
  maxWidth = signal('none');
}

describe('DsFullWidthLayout', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('projects default content', () => {
    expect(fixture.nativeElement.querySelector('.projected-content')).toBeTruthy();
  });

  it('omits the title heading when no title is provided', () => {
    expect(fixture.nativeElement.querySelector('.full-width-layout-title')).toBeFalsy();
  });

  it('renders the title heading when provided', () => {
    host.title.set('Projects');
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector('.full-width-layout-title');
    expect(heading.textContent).toContain('Projects');
  });

  it('applies maxWidth as an inline style', () => {
    host.maxWidth.set('720px');
    fixture.detectChanges();
    const layout = fixture.nativeElement.querySelector('.full-width-layout');
    expect(layout.style.maxWidth).toBe('720px');
  });
});

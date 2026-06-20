import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DsDashboardLayout } from './dashboard-layout';

@Component({
  imports: [DsDashboardLayout],
  template: `
    <ds-dashboard-layout>
      <span header class="projected-header">Title</span>
      <span class="projected-content">Body</span>
    </ds-dashboard-layout>
  `,
})
class HostComponent {}

describe('DsDashboardLayout', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders the layout shell', () => {
    const el = fixture.nativeElement;
    expect(el.querySelector('.dashboard-layout')).toBeTruthy();
    expect(el.querySelector('.dashboard-layout-header')).toBeTruthy();
    expect(el.querySelector('.dashboard-layout-content')).toBeTruthy();
  });

  it('projects [header] content into the header slot', () => {
    const header = fixture.nativeElement.querySelector('.dashboard-layout-header');
    expect(header.querySelector('.projected-header')).toBeTruthy();
    expect(header.querySelector('.projected-content')).toBeFalsy();
  });

  it('projects default content into the content slot', () => {
    const content = fixture.nativeElement.querySelector('.dashboard-layout-content');
    expect(content.querySelector('.projected-content')).toBeTruthy();
    expect(content.querySelector('.projected-header')).toBeFalsy();
  });
});

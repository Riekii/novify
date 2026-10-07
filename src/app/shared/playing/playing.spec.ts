import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Playing } from './playing';

describe('Playing', () => {
  let component: Playing;
  let fixture: ComponentFixture<Playing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Playing],
    }).compileComponents();

    fixture = TestBed.createComponent(Playing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

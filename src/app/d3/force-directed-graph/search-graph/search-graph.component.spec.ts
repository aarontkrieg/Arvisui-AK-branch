import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchGraphComponent } from './search-graph.component';

describe('ArticleGraphComponent', () => {
  let component: SearchGraphComponent;
  let fixture: ComponentFixture<SearchGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

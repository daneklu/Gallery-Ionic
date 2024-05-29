import { TestBed } from '@angular/core/testing';

import { ImageCrudService } from './image-crud.service';

describe('ImageCrudService', () => {
  let service: ImageCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

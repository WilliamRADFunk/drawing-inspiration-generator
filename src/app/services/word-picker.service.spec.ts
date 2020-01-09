import { TestBed } from '@angular/core/testing';

import { WordPickerService } from './word-picker.service';

describe('WordPickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WordPickerService = TestBed.get(WordPickerService);
    expect(service).toBeTruthy();
  });
});

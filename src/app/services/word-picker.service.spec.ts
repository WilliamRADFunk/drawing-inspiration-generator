import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { WordPickerService } from './word-picker.service';

describe('WordPickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterModule.forRoot([], {useHash: true})
      ]
  }));

  it('should be created', () => {
    const service: WordPickerService = TestBed.get(WordPickerService);
    expect(service).toBeTruthy();
  });
});

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { dictionary } from '../utils/dictionary';

@Injectable({
  providedIn: 'root'
})
export class WordPickerService {
    private word: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    public currentWord: Observable<string> = this.word.asObservable();

    constructor() {}

    getWord(): void {

    }
}

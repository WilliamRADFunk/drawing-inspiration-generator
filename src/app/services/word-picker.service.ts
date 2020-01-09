import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { dictionary } from '../utils/dictionary';
const keys = Object.keys(dictionary);
const totalWords = keys.length;

@Injectable({
  providedIn: 'root'
})
export class WordPickerService {
    private definition: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    private word: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    public currentDefinition: Observable<string> = this.definition.asObservable();
    public currentWord: Observable<string> = this.word.asObservable();

    constructor() {}

    public getWord(): void {
        const rando = Math.floor(Math.random() * totalWords);
        let randomDef;
        let randomWord;
        keys.some((key, index) => {
            if (index === rando) {
              randomWord = key;
              randomDef = dictionary[key];
              return true;
            }
        });
        this.word.next(randomWord);
        this.definition.next(randomDef);
    }
}

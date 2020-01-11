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
    private seed: number;
    private word: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    public currentDefinition: Observable<string> = this.definition.asObservable();
    public currentWord: Observable<string> = this.word.asObservable();

    constructor() {}

    // Credit to http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    private seededRandom(max: number, min: number): number {
        max = max || 1;
        min = min || 0;

        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;

        return min + rnd * (max - min);
    }

    public getWord(seed: number): void {
        this.seed = seed;
        const rando = Math.floor(this.seededRandom(0, totalWords));
        console.log('rando', rando);
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

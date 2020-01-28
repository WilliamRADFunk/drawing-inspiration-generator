import { Injectable } from '@angular/core';
import { PIXABAY_API_KEY, PIXABAY_API_URL } from '../../assets/config/pixabay';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { dictionary } from '../utils/dictionary';
import { PixabayImageHit } from '../models/pixabay-image-hit';
import { PixabayImageSearchResponse } from '../models/pixabay-image-search-response';

const unlikedWords = [
    'qua',
    'quixotical'
];

const uselessWords = [
    'to',
    'the',
    'a',
    'or',
    'in'
];

const keys = Object.keys(dictionary).filter(key => {
    const definition = dictionary[key].split(' ').filter(word => !uselessWords.includes(word.toLowerCase()));
    if (definition.length < 4
        || unlikedWords.includes(key.toLowerCase())
        || key.charAt(key.length - 1) === '-'
        || key.charAt(0) === '-'
        || key.split(' ').length > 1) {
        return false;
    }
    return true;
});

const totalWords = keys.length;

@Injectable({
  providedIn: 'root'
})
export class WordPickerService {
    private API_KEY: string = PIXABAY_API_KEY;
    private API_URL: string = PIXABAY_API_URL;
    private URL: string = this.API_URL + this.API_KEY + '&q=';
    private itemsPerPage: BehaviorSubject<number> = new BehaviorSubject<number>(20);
    private pageNum: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    private page: string = '&page=';
    private perPage = '&per_page=' + this.itemsPerPage.value;
    private minHeight = '&min_height=200';
    private totalMatches: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    private definition: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    private images: BehaviorSubject<PixabayImageHit[]> = new BehaviorSubject<PixabayImageHit[]>([]);
    private imageWord: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    private seed: number;
    private word: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    private wordHistory: BehaviorSubject<{ date: string; word: string; }[]> = new BehaviorSubject<{ date: string; word: string; }[]>([]);

    public currentDefinition: Observable<string> = this.definition.asObservable();
    public currentImages: Observable<PixabayImageHit[]> = this.images.asObservable();
    public currentImageWord: Observable<string> = this.imageWord.asObservable();
    public currentItemsPerPage: Observable<number> = this.itemsPerPage.asObservable();
    public currentPageNum: Observable<number> = this.pageNum.asObservable();
    public currentTotalMatches: Observable<number> = this.totalMatches.asObservable();
    public currentWord: Observable<string> = this.word.asObservable();
    public currentWordHistory: Observable<{ date: string; word: string; }[]> = this.wordHistory.asObservable();

    constructor(private http: HttpClient) {
      console.log('Total words', totalWords);
    }

    public changeHistoryCount(numDays: number): void {
        let currSeed = this.seed; // Today's date
        const wordHistory = [];
        for (let i = 1; i < numDays; i++) {
            currSeed = currSeed - (1000 * 60 * 60 * 24); // i days before
            wordHistory.push({ date: new Date(currSeed).toISOString().split('T')[0], word: this.getWordFromDictionary(currSeed) });
        }
        this.wordHistory.next(wordHistory.slice());
    }

    public changePage(pageNum: number): void {
        this.pageNum.next(pageNum >= 1 ? pageNum : this.pageNum.value);
        setTimeout(() => {
            this.getImages(this.imageWord.value, this.pageNum.value);
        }, 10);
    }

    public getImages(word: string, pageNum?: number): void {
        this.http.get(this.URL + word + this.perPage + this.page + (pageNum || this.pageNum.value) + this.minHeight)
            .pipe(take(1))
            .subscribe((results: PixabayImageSearchResponse) => {
                console.log('results', results);
                this.pageNum.next(pageNum || this.pageNum.value);
                this.images.next(results.hits);
                this.imageWord.next(word);
                this.totalMatches.next(results.total);
            });
    }

    public getWord(seed: number): void {
        this.pageNum.next(1);
        this.seed = seed;
        const randomWord = this.getWordFromDictionary(seed);
        const randomDef = dictionary[randomWord];
        this.word.next(randomWord);
        this.imageWord.next(randomWord);
        this.definition.next(randomDef);

        this.http.get(this.URL + randomWord + this.perPage + this.page + this.pageNum.value + this.minHeight)
            .pipe(take(1))
            .subscribe((results: PixabayImageSearchResponse) => {
                console.log('results', results);
                this.images.next(results.hits);
            });
    }

    private getWordFromDictionary(seed: number): string {
        const rando = seed % totalWords;
        let randomWord;
        keys.some((key, index) => {
            if (index === rando) {
              randomWord = key;
              return true;
            }
        });
        return randomWord;
    }
}

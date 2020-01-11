import { Injectable } from '@angular/core';
import { PIXABAY_API_KEY, PIXABAY_API_URL } from '../../assets/config/pixabay';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { dictionary } from '../utils/dictionary';
import { PixabayImageHit } from '../models/pixabay-image-hit';
import { PixabayImageSearchResponse } from '../models/pixabay-image-search-response';

const keys = Object.keys(dictionary);
const totalWords = keys.length;

@Injectable({
  providedIn: 'root'
})
export class WordPickerService {
    private API_KEY: string = PIXABAY_API_KEY;
    private API_URL: string = PIXABAY_API_URL;
    private URL: string = this.API_URL + this.API_KEY + '&q=';
    private pageNum: number = 1;
    private page: string = '&page=';
    private perPage = '&per_page=20';
    private minHeight = '&min_height=200';

    private definition: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    private images: BehaviorSubject<PixabayImageHit[]> = new BehaviorSubject<PixabayImageHit[]>([]);
    private imageWord: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    private seed: number;
    private word: BehaviorSubject<string> = new BehaviorSubject<string>('Bubbles');
    public currentDefinition: Observable<string> = this.definition.asObservable();
    public currentImages: Observable<PixabayImageHit[]> = this.images.asObservable();
    public currentImageWord: Observable<string> = this.imageWord.asObservable();
    public currentWord: Observable<string> = this.word.asObservable();

    constructor(private http: HttpClient) {}

    // Credit to http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    private seededRandom(max: number, min: number): number {
        max = max || 1;
        min = min || 0;

        this.seed = (this.seed * 9301 + 49297) % 233280;
        const rnd = this.seed / 233280;

        return min + rnd * (max - min);
    }

    public getImages(word: string, pageNum?: number): void {
        this.http.get(this.URL + word + this.perPage + this.page + (pageNum || this.pageNum) + this.minHeight)
            .pipe(take(1))
            .subscribe((results: PixabayImageSearchResponse) => {
                console.log('results', results);
                this.images.next(results.hits);
                this.imageWord.next(word);
            });
    }

    public getWord(seed: number): void {
        this.seed = seed;
        const rando = Math.floor(this.seededRandom(0, totalWords));
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
        this.imageWord.next(randomWord);
        this.definition.next(randomDef);

        this.http.get(this.URL + randomWord + this.perPage + this.page + this.pageNum + this.minHeight)
            .pipe(take(1))
            .subscribe((results: PixabayImageSearchResponse) => {
                console.log('results', results);
                this.images.next(results.hits);
            });
    }
}

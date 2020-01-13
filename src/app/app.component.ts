import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { WordPickerService } from './services/word-picker.service';
import { PixabayImageHit } from './models/pixabay-image-hit';
import { PixabayImageSearchResponse } from './models/pixabay-image-search-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    private readonly subs: Subscription[] = [];
    @ViewChild('content', { static: true }) content: any;
    public definitionOfDay: string;
    public currPage: number;
    public imageInFocus: PixabayImageHit;
    public images: PixabayImageHit[] = [];
    public imageWord: string;
    public itemsPerPage: number;
    public readonly title: string = 'drawing-inspiration-generator';
    public totalMatches: number;
    public wordOfDay: string;

    constructor(
        private readonly modalService: NgbModal,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly wordPicker: WordPickerService) {}

    ngOnDestroy() {
        this.subs.forEach(s => s && s.unsubscribe());
        this.subs.length = 0;
    }

    ngOnInit() {
        this.subs.push(
            this.route.queryParamMap.subscribe((params: ParamMap) => {
                let queriedDateAsDate: number;
                if (params.has('date')) {
                    const queriedDate: string = params.get('date');
                    console.log('queriedDate', queriedDate);
                    queriedDateAsDate = Date.parse(queriedDate);

                    if (isNaN(queriedDateAsDate) === false) {
                        this.wordPicker.getWord(new Date(queriedDateAsDate).setUTCHours(0, 0, 0, 0));
                    } else {
                        this.updateParams(new Date().setUTCHours(0, 0, 0, 0));
                    }
                } else {
                    this.updateParams(new Date().setUTCHours(0, 0, 0, 0));
                }
            }),
            this.wordPicker.currentWord.subscribe(word => {
                this.wordOfDay = word;
            }),
            this.wordPicker.currentDefinition.subscribe(definition => {
                this.definitionOfDay = definition;
            }),
            this.wordPicker.currentImages.subscribe(images => {
                this.images = images;
            }),
            this.wordPicker.currentImageWord.subscribe(word => {
                this.imageWord = word;
            }),
            this.wordPicker.currentPageNum.subscribe(pageNum => {
                this.currPage = pageNum;
            }),
            this.wordPicker.currentTotalMatches.subscribe(totalMatches => {
                this.totalMatches = totalMatches;
            }),
            this.wordPicker.currentItemsPerPage.subscribe(itemsPerPage => {
                this.itemsPerPage = itemsPerPage;
            })
        );
    }

    private updateParams(date: number): void {
        const dateObj = new Date(date);
        const year = dateObj.getUTCFullYear();
        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        this.router.navigate([], {
            queryParams: {
                date: `${
                  year}-${
                  month.toString().length === 1 ? `0${month.toString()}` : month}-${
                  day.toString().length === 1 ? `0${day.toString()}` : day}`
            },
            queryParamsHandling: 'merge'
        });
    }

    public getImagesByWord(word: string): void {
        this.wordPicker.changePage(1);
        this.wordPicker.getImages(word.replace(/\;|\.|\,/g, ''), 1);
    }

    public getLeftPageBound(): number {
        const expectedLeftBound = (this.currPage - 1) * this.itemsPerPage;
        return expectedLeftBound <= 0 ? 1 : expectedLeftBound;
    }

    public getRightPageBound(): number {
        const expectedRightBound = this.currPage * this.itemsPerPage;
        return expectedRightBound <= this.totalMatches ? expectedRightBound : this.totalMatches;
    }

    public getNewWord(): void {
        this.wordPicker.changePage(1);
        this.wordPicker.getWord(Math.random());
    }

    public getNumberOfPages(totalImages: number): number {
        return Math.ceil(totalImages / 20);
    }

    public getWordsArray(sentence: string): string[] {
        const words = sentence.replace(/\r?\n|\r/g, '').split(' ').filter(word => !!word);
        if (words.length) {
            const word = words[0];
            words[0] = word.charAt(0).toUpperCase() + word.slice(1);
        }
        return words;
    }

    public onThumbnailClick(hit: PixabayImageHit): void {
        this.imageInFocus = hit;
        this.modalService.open(this.content, {
            centered: true,
            size: 'lg',
            // windowClass: 'transparent-modal'
        })
        .result
        .then(() => {
            // Already handled this means of closing the modal.
        },
        (reason) => {
            // Since player clicked outside modal, have to handle the restart.
            if (reason === ModalDismissReasons.BACKDROP_CLICK) {
                // this.goToMenu();
            }
        });
    }

    public pageDown(): void {
        if (this.currPage > 1) {
            this.wordPicker.changePage(this.currPage - 1);
        }
    }

    public pageUp(): void {
        if (this.currPage < this.getNumberOfPages(this.totalMatches)) {
            this.wordPicker.changePage(this.currPage + 1);
        }
    }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { WordPickerService } from './services/word-picker.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
    private readonly subs: Subscription[] = [];
    public readonly title: string = 'drawing-inspiration-generator';
    public definitionOfDay: string;
    public wordOfDay: string;

    constructor(
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

                    if (isNaN(queriedDateAsDate) == false) {
                        this.wordPicker.getWord(new Date(queriedDateAsDate).setUTCHours(0,0,0,0));
                    } else {
                        this.updateParams(new Date().setUTCHours(0,0,0,0));
                    }
                } else {
                    this.updateParams(new Date().setUTCHours(0,0,0,0));
                }
            }),
            this.wordPicker.currentWord.subscribe(word => {
                this.wordOfDay = word;
            }),
            this.wordPicker.currentDefinition.subscribe(definition => {
                this.definitionOfDay = definition;
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
                date: `${year}-${month.toString().length === 1 ? `0${month.toString()}` : month}-${day.toString().length === 1 ? `0${day.toString()}` : day}`
            },
            queryParamsHandling: 'merge'
        });
    }

    public getNewWord(): void {
        this.wordPicker.getWord(Math.random());
    }
}

import { Component, OnInit } from '@angular/core';
import { WordPickerService } from './services/word-picker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public readonly title: string = 'drawing-inspiration-generator';
  public definitionOfDay: string;
  public wordOfDay: string;

  constructor(private readonly wordPicker: WordPickerService) {}

  ngOnInit() {
    this.wordPicker.currentWord.subscribe(word => {
        this.wordOfDay = word;
    });
    this.wordPicker.currentDefinition.subscribe(definition => {
        this.definitionOfDay = definition;
    });
    this.wordPicker.getWord();
  }

  public getNewWord(): void {
    this.wordPicker.getWord();
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WordPickerService } from './services/word-picker.service';
import { FrameComponent } from './components/frame/frame.component';

@NgModule({
  declarations: [
    AppComponent,
    FrameComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([{
        path: '**',
        component: FrameComponent
    }], {useHash: true})
  ],
  providers: [ WordPickerService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

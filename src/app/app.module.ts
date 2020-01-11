import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { WordPickerService } from './services/word-picker.service';

// const appRoutes = [
//     {
//         path: '**/:date',
//         component: AppComponent,
//         pathMatch: 'full'
//     }
// ];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    RouterModule.forRoot([], {useHash: true})
  ],
  providers: [ WordPickerService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

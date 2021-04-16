import { NgModule, ErrorHandler} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { from } from 'rxjs';

import {MatInputModule} from '@angular/material/input/';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion'

import { AppComponent} from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { HeaderComponent } from './header/header.component';
import { NameComponent } from './posts/post-list/post-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    NameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [{provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent} from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent
  ],
  imports: [
    AppRoutingModule,
    AngularMaterialModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PostsModule,
    AuthModule
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi: true }
  ],

  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}

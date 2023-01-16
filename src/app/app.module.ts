import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';

// Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './sesion/login/login.component';
import { NoPageFoundComponent } from './shared/no-page-found/no-page-found.component';
import { NuevaPasswordComponent } from './sesion/nueva-password/nueva-password.component';
import { RecuperarPasswordComponent } from './sesion/recuperar-password/recuperar-password.component';

// Modulos
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';


import { JwtInterceptor } from 'src/helpers/Interceptors/jwt.interceptor';
import { ErrorInterceptor } from 'src/helpers/Interceptors/error.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NoPageFoundComponent,
    RecuperarPasswordComponent,
    NuevaPasswordComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatRadioModule,
    AppRoutingModule,
    PagesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DATE_LOCALE, useValue: "es-MX" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

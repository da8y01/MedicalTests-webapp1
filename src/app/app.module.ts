import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientComponent } from './patient/patient.component';
import { MedicComponent } from './medic/medic.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';

import localeEs from '@angular/common/locales/es'
import {registerLocaleData} from '@angular/common';
import { ResultsListComponent } from './results-list/results-list.component';
import { PatientSearchComponent } from './patient-search/patient-search.component'
registerLocaleData(localeEs, 'es')

@NgModule({
  declarations: [
    AppComponent,
    PatientComponent,
    MedicComponent,
    PageNotFoundComponent,
    LoginComponent,
    ResultsListComponent,
    PatientSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  // providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

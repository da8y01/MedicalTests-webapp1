import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PatientComponent } from './patient/patient.component';
import { MedicComponent } from './medic/medic.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ResultsListComponent } from './results-list/results-list.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { HeaderComponent } from './header/header.component';
import { LogoutComponent } from './logout/logout.component';
// import { PaginatorIntl, PaginatorIntlModule } from './paginator-intl';
import { AdminComponent } from './admin/admin.component';
import { AuthInterceptor } from './auth-interceptor';
import { FooterComponent } from './footer/footer.component';
import { UsersSelectableListComponent } from './users-selectable-list/users-selectable-list.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { UpdatePatientComponent } from './update-patient/update-patient.component';
import { CreateMedicComponent } from './create-medic/create-medic.component';
import { UpdateMedicComponent } from './update-medic/update-medic.component';
import { UsersPopulatedListComponent } from './users-populated-list/users-populated-list.component';
import { ReaderComponent } from './reader/reader.component';
import { UpdateReadingsComponent } from './update-readings/update-readings.component';
import { ResultsListReaderComponent } from './results-list-reader/results-list-reader.component';

// import { FileSelectDirective } from 'ng2-file-upload';

registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    PatientComponent,
    MedicComponent,
    PageNotFoundComponent,
    LoginComponent,
    ResultsListComponent,
    PatientSearchComponent,
    HeaderComponent,
    LogoutComponent,
    AdminComponent,
    FooterComponent,
    UsersSelectableListComponent,
    CreatePatientComponent,
    // FileSelectDirective,
    UpdatePatientComponent,
    CreateMedicComponent,
    UpdateMedicComponent,
    UsersPopulatedListComponent,
    ReaderComponent,
    UpdateReadingsComponent,
    ResultsListReaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    // FileSelectDirective,
    FormsModule,
  ],
  // providers: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  // providers: [{provide: MatPaginatorIntl, useClass: CustomPaginatorIntl}],
  // providers: [{provide: LOCALE_ID, useValue: 'es'}],
  bootstrap: [AppComponent],
})
export class AppModule {}

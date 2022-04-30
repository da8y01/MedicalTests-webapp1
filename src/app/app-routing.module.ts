import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientComponent } from './patient/patient.component';
import { MedicComponent } from './medic/medic.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { LogoutComponent } from './logout/logout.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { UpdatePatientComponent } from './update-patient/update-patient.component';
import { UserResolver } from './user.resolver';
import { CreateMedicComponent } from './create-medic/create-medic.component';
import { UpdateMedicComponent } from './update-medic/update-medic.component';
import { ReaderComponent } from './reader/reader.component';

const routes: Routes = [
  { path: 'patient', component: PatientComponent, canActivate: [AuthGuard] },
  { path: 'reader', component: ReaderComponent, canActivate: [AuthGuard] },
  { path: 'medic', component: MedicComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  {
    path: 'create-patient',
    component: CreatePatientComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'create-medic',
    component: CreateMedicComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'update-patient/:id',
    component: UpdatePatientComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
    },
  },
  {
    path: 'update-medic/:id',
    component: UpdateMedicComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
    },
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

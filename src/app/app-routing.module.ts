import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatComponent } from './cat/cat.component';
import { CatCreateComponent } from './cat-create/cat-create.component';
import { CatEditComponent } from './cat-edit/cat-edit.component';

const routes: Routes = [
  {
    path: 'cats',
    component: CatComponent
  },
  {
    path: 'create',
    component: CatCreateComponent
  },
  {
    path: 'edit/:id',
    component: CatEditComponent
  },
  // {
  //   path: 'search',
  //   component: 
  // },
  { path: '', redirectTo: '/cats', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

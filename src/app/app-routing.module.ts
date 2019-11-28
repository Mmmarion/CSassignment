import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PageNotFindComponent } from "./page-not-find/page-not-find.component";
import { FormComponent } from "./form/form.component";

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/dashboard" },
  { path: "dashboard", component: DashboardComponent },
  { path: "form", component: FormComponent },
  { path: "form/:id", component: FormComponent },
  { path: "not-found", component: PageNotFindComponent },
  { path: "**", redirectTo: "/not-found" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

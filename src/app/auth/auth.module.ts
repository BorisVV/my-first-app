import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { AngularMaterialModule } from "../angular-material.module";
import { LoginComponent } from "./login/login.component";
import { SignUpComponent } from "./signup/signup.component";

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    FormsModule
  ]
})
export class AuthModule {}

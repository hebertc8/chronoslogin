import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ObserverService } from './observer.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(private observer: ObserverService) { }

  validateColor(estado, colorestado, coloraux, hastaaux, hastaestado, tiempo, aux) {

    if (aux) {
      if (Number(hastaaux) !== 0 && tiempo >= Number(hastaaux)) {
        return '#C03529';
      } else {
        return this.selectColor(coloraux);
      }


    } else {
      if (Number(hastaestado) !== 0 && tiempo >= Number(hastaestado)) {
        return '#C03529';
      } else {
        return this.selectColor(colorestado);
      }


    }
  }

  selectColor(n) {
    return this.observer.Colors[n];
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      // if control is empty return no error
      return null;
    }

    // test the value of the control against the regexp supplied
    const valid = regex.test(control.value);

    // if true, return no error (no error), else return error passed in the second parameter
    return valid ? null : error;
  };
}
}

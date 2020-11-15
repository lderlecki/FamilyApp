import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // return null if control is empty
        return null;
      }
      // test the value against given regex
      const valid = regex.test(control.value);

      // if true return no error, else return error passed as second function parameter
      return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl, passwordKey = 'password', passwordRepeatKey = 'password2') {
    const password: string = control.get(passwordKey).value;
    const password2: string = control.get(passwordRepeatKey).value;

    // check if passwords are the same
    if (password !== password2) {
      // if they don't match, set error in ''passwordRepeatKey'' form control
      control.get(passwordRepeatKey).setErrors({NoPasswordMatch: true});
    }
  }
}

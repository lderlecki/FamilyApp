import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ProfileService} from '../../services/profile.service';
import {MatDialog} from '@angular/material/dialog';
import {InvitationService} from '../../services/invitation.service';
import {Location} from '@angular/common';
import {Family} from '../../models/family';
import {Profile} from '../../models/profile';
import {FamilyService} from '../../services/family.service';
import {TokenAuthService} from '../../services/tokenAuth.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-my-family',
  templateUrl: './my-family.component.html',
  styleUrls: ['./my-family.component.scss'],
  providers: [ProfileService, InvitationService, FamilyService],
})
export class MyFamilyComponent implements OnInit {
  myFamily;
  myProfile: Profile;
  public familyMembers: any;
  public createFamilyForm: FormGroup;

  @ViewChild('searchInput') private searchInput: ElementRef;

  constructor(
    protected familyService: FamilyService,
    protected profileService: ProfileService,
    protected toastr: ToastrService,
    protected translate: TranslateService,
    private fb: FormBuilder,
    protected _location: Location,
    private authService: TokenAuthService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.myFamily = this.familyService.familyValue;
    if (this.myFamily === null) {
      this.createFamilyForm = this.fb.group({
        family_name: ['1', [Validators.required]],
        budget: [0.0, [Validators.required]],
        family_head: [this.authService.profileValue.id, [Validators.required]],
        address: this.fb.group({
          territory: ['1', [Validators.required]],
          city: ['1', [Validators.required]],
          street: ['1', [Validators.required]],
          street_no: ['1', [Validators.required]],
          flat_no: ['1'],
          postal_code: ['1', [Validators.required]],
        })
      });
    }
  }

  createFamily(data) {
    this.familyService.createFamily(data).subscribe( response => {
      const profile = this.authService.profileValue;
      console.log('in response family create');
      console.log(response);
      profile.family = response;
      this.authService.changeProfileSubject(profile);
      this.authService.updateProfileLocalStorage();
      this.toastr.success('Family created successfully.');
      location.reload();
    });
  }

  navigateToSearchComponent() {
    this.router.navigate(['/search/' + this.searchInput.nativeElement.value + '/families']);
  }


}

import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-my-family',
  templateUrl: './my-family.component.html',
  styleUrls: ['./my-family.component.scss'],
  providers: [ProfileService, InvitationService, FamilyService],
})
export class MyFamilyComponent implements OnInit {
  myFamily;
  myProfile: Profile;

  constructor(protected familyService: FamilyService, protected profileService: ProfileService,
              protected toastr: ToastrService, protected translate: TranslateService,
              protected _location: Location, private authService: TokenAuthService) {

  }

  ngOnInit(): void {
    const myProfile = this.authService.profileValue;
    this.myFamily = myProfile.family;
    console.log('profile family: ', this.myFamily);
    this.familyService.sendFamilyData(this.myFamily);
  }
}

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
import {Router} from '@angular/router';

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

  constructor(private router: Router, protected familyService: FamilyService, protected profileService: ProfileService,
              protected toastr: ToastrService, protected translate: TranslateService,
              protected _location: Location, private authService: TokenAuthService) {

  }

  ngOnInit(): void {
    this.myFamily = this.familyService.familyValue;
    this.router.navigate(['myFamily/gallery']);
    console.log('familymembers: ', this.familyService.familyMembers);
    console.log('my family value in my family component: ', this.myFamily);
  }
}

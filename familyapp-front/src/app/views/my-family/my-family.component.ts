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

@Component({
  selector: 'app-my-family',
  templateUrl: './my-family.component.html',
  styleUrls: ['./my-family.component.scss'],
  providers: [ProfileService, InvitationService, FamilyService],
})
export class MyFamilyComponent implements OnInit {
  myFamily: Family;
  myProfile: Profile;
  constructor(protected familyService: FamilyService, protected profileService: ProfileService,
              protected toastr: ToastrService, protected translate: TranslateService,
              protected _location: Location) {

  }


  ngOnInit(): void {
    this.profileService.getProfile(20).subscribe(response => {
      this.profileService.getFamilyForProfile(response.body.id).subscribe(response1 => {
        this.myProfile = response.body;
        this.myFamily = response1.body;
        this.familyService.sendFamilyData(this.myFamily);
        if (response1.body == null) {
          console.log('This user doesnt have family');
          this._location.back(); // redirect to last page
        }
      });
    });
  }
}

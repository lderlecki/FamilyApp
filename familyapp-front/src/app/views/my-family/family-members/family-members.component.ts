import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProfileService} from '../../../services/profile.service';
import {MatDialog} from '@angular/material/dialog';
import {InvitationService} from '../../../services/invitation.service';
import {Location} from '@angular/common';
import {MyTableComponent} from '../../../components/tables/list-users-families-table/my-table.component';
import {PeriodicElement} from '../../list-profiles/list-profile.component';
import {MyFamilyComponent} from '../my-family.component';
import {Profile} from '../../../model/profile';
import {Family} from '../../../model/family';
import {FamilyService} from '../../../services/family.service';
import {Subscription} from 'rxjs';
import {MatSpinner} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-my-family',
  templateUrl: './family-members.component.html',
  styleUrls: ['./family-members.component.scss'],
})
export class FamilyMembersComponent implements OnInit, OnDestroy, AfterViewInit {
  data: any;
  @ViewChild('myChild') private myChild: MyTableComponent;
  tableData: any;
  subscription: Subscription;

  constructor(private familyService: FamilyService, private toastr: ToastrService, private translate: TranslateService, private dialog: MatDialog, private_location: Location) {
  }

  ngOnInit(): void {


    this.subscription = this.familyService.getData().subscribe(data => {
      this.tableData = data?.familyMembers;
      setTimeout(() => {
        this.myChild.init(this.tableData);
        document.getElementById('mySpinner').remove();
        }
        , 500);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
  }

}

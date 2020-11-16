import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProfileService} from '../../../services/profile.service';
import {MatDialog} from '@angular/material/dialog';
import {InvitationService} from '../../../services/invitation.service';
import {Location} from '@angular/common';
import {MyFamilyComponent} from '../my-family.component';
import {FamilyService} from '../../../services/family.service';
import {ListInvitationTableComponent} from '../../../components/tables/list-invitation-table/list-invitation-table.component';
import {Subscription} from 'rxjs';
import {Family} from '../../../models/family';
import {Invitation} from '../../../models/invitation';

@Component({
  selector: 'app-my-family-invitations',
  templateUrl: './family-invitations.component.html',
  styleUrls: ['./family-invitations.component.scss'],
  providers: [ProfileService, InvitationService],
})
export class FamilyInvitationsComponent implements OnInit {
  viewForFamily: boolean;
  data: any;
  subscription: Subscription;
  family: Family;
  @ViewChild('myChild') private myChild: ListInvitationTableComponent;
  tableData: Invitation[];
  constructor(private familyService: FamilyService, private invitationService: InvitationService, private toastr: ToastrService,
              private translate: TranslateService, private dialog: MatDialog) {
  }


  ngOnInit(): void {
    this.subscription = this.familyService.getData().subscribe(data => {
      this.family = data;
        setTimeout(() => {
            this.prepareData();
            document.getElementById('mySpinner').remove();
          }
          , 500);
      });
  }
  prepareData() {
    this.viewForFamily = true;
    this.fetchDataForFamily(this.family.id);
  }

    fetchDataForFamily(familyId: number) {
    this.invitationService.getInvitationsForFamily(familyId).subscribe(response => {
      if (response.status === 200) {
        this.translate.get('LIST_INVITATIONS.FETCHSUCCESS').subscribe(res => {
          this.toastr.success(res);
        });
        this.tableData = response.body;
        this.myChild.init(this.tableData);
      }
    }, error => {
      this.translate.get('LIST_INVITATIONS.FETCHERROR').subscribe(res => {
        this.toastr.error(res);
      });
    });
  }

  selectedRow(data: any) {
    if (data.acceptance) {
      this.invitationService.acceptInvitation(data.id).subscribe(response => {
        this.prepareData();
      }, error1 => {
        if (error1.error.status === 409) {
          this.translate.get('LIST_INVITATIONS.ACCEPT_ALREADY_IN_FAMILY').subscribe(res => {
            this.toastr.error(res);
          });
        }
      });
    } else {
      this.invitationService.rejectInvitation(data.id).subscribe(response => {
        this.prepareData();
      });
    }
  }
}

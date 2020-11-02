import {Component, OnInit, ViewChild} from '@angular/core';
import {FamilyService} from '../../services/family.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {InvitationService} from '../../services/invitation.service';
import {ListInvitationTableComponent} from '../../components/tables/list-invitation-table/list-invitation-table.component';
import {Family} from '../../model/family';
import {ActivatedRoute} from '@angular/router';

export interface PeriodicElement {
  id: number;
  date: Date;
  family: Object;
  profile: Object;
}
@Component({
  selector: 'app-list-invitation',
  templateUrl: './list-invitation.component.html',
  styleUrls: ['./list-invitation.component.scss'],
  providers: [InvitationService],
})
export class ListInvitationComponent implements OnInit {
  data: any;
  viewForFamily: boolean;
  @ViewChild('myChild') private myChild: ListInvitationTableComponent;
  tableData: PeriodicElement[];
  constructor(private route: ActivatedRoute, private invitationService: InvitationService, private toastr: ToastrService, private translate: TranslateService ) { }


  ngOnInit(): void {
    this.prepareData();
  }

  prepareData() {
      this.viewForFamily = false;
      this.fetchDataForProfile(20); // #TODO HARD CODED VALUE
  }
  fetchDataForProfile(profileId: number) {
    this.invitationService.getInvitationsForProfile(profileId).subscribe(response => {
      if (response.status === 200) {
        this.translate.get('LIST_INVITATIONS.FETCHSUCCESS').subscribe(res => {
          this.toastr.success(res);
        });
        this.tableData = response.body;
        console.log(this.tableData)
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

import {Component, OnInit, ViewChild} from '@angular/core';
import {FamilyService} from '../../services/family.service';
import {MyTableComponent} from '../../components/tables/list-users-families-table/my-table.component';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {Family} from '../../models/family';
import {InviteToFamilyDialogComponent} from '../../components/dialogs/invite-to-family/invite-to-family-dialog';
import {InvitationDTO} from '../list-profiles/list-profile.component';
import {MatDialog} from '@angular/material/dialog';
import {InvitationService} from '../../services/invitation.service';

export interface PeriodicElement {
  familyName: string;
  budget: number;
}

@Component({
  selector: 'app-listfamily',
  templateUrl: './list-family.component.html',
  styleUrls: ['./list-family.component.scss'],
  providers: [FamilyService],
})
export class ListFamilyComponent implements OnInit {
  data: any;
  @ViewChild('myChild') private myChild: MyTableComponent;
  tableData: PeriodicElement[];
  constructor(private invitationService: InvitationService, private familyService: FamilyService, private toastr: ToastrService,
              private translate: TranslateService, private dialog: MatDialog ) { }


  ngOnInit(): void {
    this.familyService.getAllFamilies().subscribe(response => {
      if (response.status === 200) {
        this.translate.get('LIST_FAMILIES.FETCHSUCCESS').subscribe(res => {
          this.toastr.success(res);
        });
        console.log(response.body);
        this.tableData = response.body;
        this.myChild.init(this.tableData);
      } }, error => {
      this.translate.get('LIST_FAMILIES.FETCHERROR').subscribe(res => {
      this.toastr.error(res); });
    });
  }

  invite(family: Family) {
    const myName = 'Jacek'; // #TODO HERE SHOULD BE MY LAST NAME
    const myLastName = 'Robak'; // #TODO HERE SHOULD BE MY LAST NAME
    const myId = 20; // #TODO HERE SHOULD BE MY ID
    const dialog = this.dialog.open(InviteToFamilyDialogComponent, {
      data: {
        profileSurname: myName,
        profileName: myLastName,
        familyName: family.familyName,
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        const idto = new InvitationDTO();
        idto.familyId = family.id
        idto.profileId = myId;
        idto.invitedByFamily = false;
        this.invitationService.sendInvitation(idto).subscribe(response1 => {
          this.translate.get('LIST_FAMILIES.INVITE_SUCCESS_1').subscribe(res => {
            this.toastr.success(res + '<font color=\"#d3d3d3\"><b>' + family.familyName +
              '</b></red></font>',
              '' , {
                enableHtml: true,
                closeButton: true,
              });
          });
        }, error1 => {
          if (error1.error.status === 409) {
            this.translate.get('LIST_FAMILIES.INVITE_CONFLICT_1').subscribe(res => {
              this.translate.get('LIST_FAMILIES.INVITE_CONFLICT_2').subscribe(rex => {
                this.toastr.error(res + '<font color=\"#d3d3d3\"><b>' + family.familyName  +
                  '</b></font>' + rex,
                  '' , {
                    enableHtml: true,
                    closeButton: true,
                  });
              });
            });
          }
          if (error1.error.status === 406) {
            this.translate.get('LIST_FAMILIES.INVITE_NOT_ACCEPTABLE_1').subscribe(res => {
                this.toastr.error(res + '<font color=\"#d3d3d3\"><b>' + family.familyName  +
                  '</b></font>',
                  '' , {
                    enableHtml: true,
                    closeButton: true,
                  });
            });
          }
        });
      }
    });
  }
}

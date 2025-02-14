import {Component,OnInit, ViewChild} from '@angular/core';
import {MyTableComponent} from '../../../components/tables/list-users-families-table/my-table.component';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProfileService} from '../../../services/profile.service';
import {MatDialog} from '@angular/material/dialog';
import {InviteToFamilyDialogComponent} from '../../../components/dialogs/invite-to-family/invite-to-family-dialog';
import {Profile} from '../../../models/profile';
import {InvitationService} from '../../../services/invitation.service';
import {ActivatedRoute} from '@angular/router';

export interface PeriodicElement {
  familyName: string;
  budget: number;
}

export class InvitationDTO {
  familyId: number;
  profileId: number;
}

@Component({
  selector: 'app-listprofile',
  templateUrl: './list-profile.component.html',
  styleUrls: ['./list-profile.component.scss'],
  providers: [ProfileService, InvitationService],
})
export class ListProfileComponent implements OnInit {
  data: any;
  @ViewChild('myChild') private myChild: MyTableComponent;
  tableData: PeriodicElement[];

  constructor(private invitationService: InvitationService, private profileService: ProfileService,
              private toastr: ToastrService, private translate: TranslateService, private dialog: MatDialog,
              private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.profileService.findWhereNameOrSurnameLike(this.route.parent.snapshot.paramMap.get('searchParam')).subscribe(response => {
      if (response.status === 200) {
        this.translate.get('LIST_PROFILES.FETCHSUCCESS').subscribe(res => {
          this.toastr.success(res);
        });
        this.tableData = response.body;
        this.myChild.init(this.tableData);
      }
    }, error => {
      this.translate.get('LIST_PROFILES.FETCHERROR').subscribe(res => {
        this.toastr.error(res);
      });
    });
  }

  invite(profile: Profile) {
    const dialog = this.dialog.open(InviteToFamilyDialogComponent, {
      data: {
        profileSurname: profile.surname,
        profileName: profile.name,
        familyName: 'Karolak', // #TODO HERE SHOULD BE MY FAMILY NAME (CHECK IF USER HAS FAMILY/IS FAMILY HEAD)
      }
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        const idto = new InvitationDTO();
        idto.familyId = 3; // #TODO HERE SHOULD BE MY FAMILY ID (CHECK IF USER HAS FAMILY/IS FAMILY HEAD)
        idto.profileId = profile.id;
        this.invitationService.sendInvitation(idto).subscribe(response1 => {
          this.translate.get('LIST_PROFILES.INVITE_SUCCESS_1').subscribe(res => {
              this.toastr.success(res + '<font color=\"#d3d3d3\"><b>' + ' '  + profile.name + ' ' + profile.surname + ' ' +
                '</b></red></font>',
                '' , {
                  enableHtml: true,
                  closeButton: true,
            });
          });
        }, error1 => {
          if (error1.error.status === 409) {
            this.translate.get('LIST_PROFILES.INVITE_CONFLICT_1').subscribe(res => {
              this.translate.get('LIST_PROFILES.INVITE_CONFLICT_2').subscribe(rex => {
                this.toastr.error(res + '<font color=\"#d3d3d3\"><b>' + profile.name + ' ' + profile.surname  +
                  '</b></font>' + rex,
                  '' , {
                    enableHtml: true,
                    closeButton: true,
                  });
              });
            });
          }
          if (error1.error.status === 406) {
            this.translate.get('LIST_PROFILES.INVITE_NOT_ACCEPTABLE_1').subscribe(res => {
              this.translate.get('LIST_PROFILES.INVITE_NOT_ACCEPTABLE_2').subscribe(rex => {
                this.toastr.error(res + '<font color=\"#d3d3d3\"><b>' + profile.name + ' ' + profile.surname  +
                  '</b></font>' + rex,
                  '' , {
                    enableHtml: true,
                    closeButton: true,
                  });
              });
            });
          }
        });
      }
    });
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {ListInvitationTableComponent} from '../../../components/tables/list-invitation-table/list-invitation-table.component';
import {TranslateService} from '@ngx-translate/core';
import {InvitationService} from '../../../services/invitation.service';
import {Invitation} from '../../../models/invitation';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public profileData: any;
  public password: string;
  public newPassword: string;
  public newPassword2: string;
  data: any;
  viewForFamily: boolean;
  @ViewChild('myChild') private myChild: ListInvitationTableComponent;
  tableData: Invitation[];

  constructor(
    public authService: TokenAuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private invitationService: InvitationService
  ) {
  }

  ngOnInit(): void {
    this.profileData = JSON.parse(localStorage.getItem('profile'));
    this.prepareData();
  }

  prepareData() {
    this.viewForFamily = false;
    this.fetchDataForProfile(this.profileData.id);
  }

  updateProfileData() {
    const token = this.authService.getToken();
    const uid = this.authService.getUid();
    this.userService.updateProfileData(token, uid, this.profileData).subscribe(
      response => {
        this.toastr.success('Personal data updated successfully');
        localStorage.setItem('profile', JSON.stringify(response));
      }, error => {
        console.log(error);
        this.toastr.error('Error, please try again.');
      }
    );
    console.log(this.profileData);
  }

  changePassword() {
    const data = {
      old_password: this.password,
      new_password: this.newPassword,
      new_password2: this.newPassword,
    };
    this.userService.changeUserPassword(data).subscribe(
      response => {
        this.toastr.success('Password changed successfully');
      }, error => {
        this.toastr.error('Error, please try again.');
      }
    );
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

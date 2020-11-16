import {Component, OnInit, ViewChild} from '@angular/core';
import {TokenAuthService} from '../../../services/tokenAuth.service';
import {UserService} from '../../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from '../../../_helpers/custom-validators';
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
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  data: any;
  viewForFamily: boolean;
  @ViewChild('myChild') private myChild: ListInvitationTableComponent;
  tableData: Invitation[];

  constructor(
    public authService: TokenAuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private invitationService: InvitationService
  ) {
  }

  ngOnInit(): void {
    this.profileData = this.authService.profileValue;
    this.profileForm = this.fb.group({
      name: [this.profileData.name, Validators.required],
      email: [this.profileData.email, Validators.required],
      surname: [this.profileData.surname, Validators.required],
      phone: [this.profileData.phone, Validators.required],
    });
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        CustomValidators.patternValidator(/\d/, {hasNumber: true}),
        CustomValidators.patternValidator(/[A-Z]/, {hasCapitalCase: true}),
        CustomValidators.patternValidator(/[a-z]/, {hasSmallCase: true}),
        Validators.minLength(8)
      ])],
      password2: ['', Validators.compose([Validators.required])],
    }, {
      validator: CustomValidators.passwordMatchValidator
    });
    this.profileData = JSON.parse(localStorage.getItem('profile'));
    this.prepareData();
  }

  prepareData() {
    this.viewForFamily = false;
    this.fetchDataForProfile(this.profileData.id);
  }

  updateProfileData(data) {
    const token = this.authService.token;
    const uid = this.authService.uid;
    this.userService.updateProfileData(token, uid, data).subscribe(
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

  changePassword(data) {
    this.userService.changeUserPassword(data).subscribe(
      response => {
        this.toastr.success('Password changed successfully');
        this.passwordForm.reset();
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

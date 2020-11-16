import {Component,OnInit, ViewChild} from '@angular/core';
import {MyTableComponent} from '../../components/tables/list-users-families-table/my-table.component';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProfileService} from '../../services/profile.service';
import {MatDialog} from '@angular/material/dialog';
import {InviteToFamilyDialogComponent} from '../../components/dialogs/invite-to-family/invite-to-family-dialog';
import {Profile} from '../../models/profile';
import {InvitationService} from '../../services/invitation.service';


@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {

  constructor(private toastr: ToastrService, private translate: TranslateService) {
  }


  ngOnInit(): void {
  }
}

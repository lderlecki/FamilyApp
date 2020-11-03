import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {Location} from '@angular/common';
import {MyTableComponent} from '../../../components/tables/list-users-families-table/my-table.component';
import {FamilyService} from '../../../services/family.service';
import {Subscription} from 'rxjs';


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

  constructor(private familyService: FamilyService) {
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

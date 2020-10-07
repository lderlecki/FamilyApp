import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {UserService} from '../../services/user.service';
import {FamilyService} from '../../services/family.service';
import {MyTableComponent} from '../../components/table/my-table.component';
import {ToastrService} from 'ngx-toastr';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';

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
  foo;
  @ViewChild('myChild') private myChild: MyTableComponent;
  tableData: PeriodicElement[];
  constructor(private familyService: FamilyService, private toastr: ToastrService, private translate: TranslateService ) { }


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
}

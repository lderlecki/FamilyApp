import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute} from '@angular/router';
import {ProfileService} from '../../../services/profile.service';

@Component({
  selector: 'app-my-table',
  templateUrl: './my-table.component.html',
  styleUrls: ['./my-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class MyTableComponent implements OnInit {
  @Input() tableData;
  @Input() columnHeader;
  @Input() expanded = false;
  @Input() family = false;
  @Output()
  public outputObject = new EventEmitter<Object>();
  objectKeys = Object.keys;
  dataSource;
  expandedElement;
  @Output('ngInit') initEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  profileImageBlob;
  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
  }
  initializeTable() {
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  init(data) {

    this.tableData = data; // get data
    this.initializeTable(); // and initialize table
  }

  sendInvitation(element: any) {
    this.outputObject.emit(element);
  }
  getProfileImage(expanded: any, row: any) {
    if (expanded === true && this.family === false) {
      this.profileService.getProfileImage(row.id).subscribe(response => {
        if (response.status === 200) {
          this.profileImageBlob = response.body.image;
        } else if (response.status === 404) {
          console.log('profile image not found');
        }
      });
    }
  }
}

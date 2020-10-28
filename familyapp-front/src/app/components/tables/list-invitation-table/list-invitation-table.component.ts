import {Component, Input, OnInit, EventEmitter, Output} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
export interface PeriodicElement {
  family: Object;
  profile: Object;
}
export class OutputData {
  acceptance: boolean;
  id: number;
}
@Component({
  selector: 'app-list-invitation-table',
  templateUrl: './list-invitation-table.component.html',
  styleUrls: ['./list-invitation-table.component.scss'],
})

export class ListInvitationTableComponent implements OnInit {
  @Input() tableData;
  @Input() columnHeader;
  @Input() familyView: boolean;
  @Output()
  public selectedRow = new EventEmitter<Object>();
  outputData: OutputData;
  objectKeys = Object.keys;
  dataSource;
  constructor( ) { }

  ngOnInit(): void {

  }

  initializeTable() {
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  init(data: PeriodicElement[]) {
    this.tableData = data; // get data
    this.initializeTable(); // and initlize table
  }
  acceptButtonClicked(id: number) {
   this.emitEvent(id, true);
  }

  rejectButtonClicked(id: number) {
    this.emitEvent(id, false);
  }
  emitEvent(id: number, flag: boolean) {
    if (!isNaN(id)) {
      {
        this.outputData = new OutputData();
        this.outputData.acceptance = flag;
        this.outputData.id = id;
        this.selectedRow.emit(this.outputData);
      }
    }
  }

}

import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Component, Inject, OnInit} from '@angular/core';


@Component({
  selector: 'app-invite-to-family-dialog',
  templateUrl: './invite-to-family-dialog.html',
  styleUrls: ['./invite-to-family-dialog.scss'],
})
export class InviteToFamilyDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}

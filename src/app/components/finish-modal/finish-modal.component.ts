import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-finish-modal',
  templateUrl: './finish-modal.component.html',
  styleUrls: ['./finish-modal.component.scss']
})
export class FinishModalComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<FinishModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  message: string = ''

  ngOnInit(): void {
    this.message = this.data.message;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

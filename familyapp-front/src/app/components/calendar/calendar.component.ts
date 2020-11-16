import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Todolist} from '../../models/todolist';

export class SelectedDateDto {
  selectedDate: Date;
  familyToDoList: Todolist[];
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  totaldaysinMonth: number;
  daysInMonth: any;
  monthIndex: number;
  currentYear: number;
  currentDate: Date;
  firstDay;
  appYearAndMonth: boolean;
  @Input() tasks;
  @ViewChild('yearInput') private yearInput: ElementRef;
  toDoLists: Todolist[];
  @Output()
  public outputObject = new EventEmitter<Object>();
  constructor( ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.monthIndex = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.calculateTotalNoOfDaysAndFirstDay();

  }
  nextMonth() {
    if (this.monthIndex === 11) {
      this.monthIndex = 0;
    } else {
      this.monthIndex++;
    }
    this.calculateTotalNoOfDaysAndFirstDay();
  }
  prevMonth() {
    if (this.monthIndex === 0) {
      this.monthIndex = 11;
    } else {
      this.monthIndex--;
    }
    this.calculateTotalNoOfDaysAndFirstDay();


  }
  nextYear() {
      this.currentYear = (+this.currentYear + 1 );
    this.yearInput.nativeElement.value = this.currentYear;
    this.calculateTotalNoOfDaysAndFirstDay();
  }
  prevYear() {

    this.currentYear -= 1;
    console.log(' current year prev year' + this.currentYear)
    this.yearInput.nativeElement.value = this.currentYear;
    this.calculateTotalNoOfDaysAndFirstDay();
    }

  changeYearToTypedYear() {
    this.currentYear = +this.yearInput.nativeElement.value;
    this.calculateTotalNoOfDaysAndFirstDay();
  }
  counter(i: number) {
    return new Array(i);
  }

  calculateTotalNoOfDaysAndFirstDay() {
    this.totaldaysinMonth = new Date(this.currentYear, this.monthIndex + 1, 0).getDate();
    this.daysInMonth = new Array();
    for (let i = 1; i <= this.totaldaysinMonth; i++) {
      this.daysInMonth[i - 1] = i;
    }
    this.firstDay = new Date(this.currentYear, this.monthIndex, 1).getDay() - 1;
    this.firstDay = this.firstDay === -1 ? 6 : this.firstDay;
    this.firstDay = this.firstDay === 0 ? 0 : this.firstDay;
    if (this.currentDate.getMonth() === this.monthIndex && this.currentDate.getFullYear() === this.currentYear) {
      this.appYearAndMonth = true;
    } else {
      this.appYearAndMonth = false;
    }

  }

  getClickedDayAndCreateFullDate(day: number) {
    const outputDto = new SelectedDateDto();
    outputDto.familyToDoList = this.toDoLists;
    outputDto.selectedDate = new Date(this.currentYear, this.monthIndex, day + 1);
    this.outputObject.emit(outputDto);
  }

  init(data: Todolist[]) {
    this.toDoLists = data;
  }

  checkTasksForDay(dayNum: number) {
    if (this.toDoLists !== undefined) {
      let totalTasksForDay = 0;
      for (let i = 0; i < this.toDoLists.length; i++) {
        const taskDate = new Date(Date.parse(this.toDoLists[i].dueDate?.toString()));
        const myDayString = this.currentYear + ' ' + (this.monthIndex) + ' ' + dayNum;
        const taskDateString = taskDate.getFullYear() + ' ' + (taskDate.getMonth()) + ' ' + taskDate.getDate();
        if (myDayString === taskDateString) {
          for (let j = 0; j < this.toDoLists[i].tasks.length; j++) {
            // if(this.toDoLists[i].tasks[j].responsiblePerson.id === this.loggedUser.id) // #TODO PRINT TASKS ONLY FOR LOGGED USER?
            totalTasksForDay += 1;
          }
        }
      }
      return totalTasksForDay;
    }
    return 0;
  }


}

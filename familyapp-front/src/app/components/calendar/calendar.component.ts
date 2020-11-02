import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Todolist} from '../../model/todolist';

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
  yearIndex: number;
  currentDate: Date;
  firstDay;
  appYearAndMonth: boolean;
  @Input() tasks;
  years = [2020, 2021, 2022, 2023, 2024, 2025 , 2026, 2027];
  toDoLists: Todolist[];
  @Output()
  public outputObject = new EventEmitter<Object>();
  constructor( ) { }

  ngOnInit(): void {
    this.currentDate = new Date();
    this.monthIndex = this.currentDate.getMonth();
    this.yearIndex = this.years.indexOf(this.currentDate.getFullYear());
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
    if (this.yearIndex === this.years.length - 1) {
      this.yearIndex = 0;
    } else {
      this.yearIndex++;
    }
    this.calculateTotalNoOfDaysAndFirstDay();
  }
  prevYear() {
    if (this.yearIndex === 0) {
      this.yearIndex = this.years.length - 1;
    } else {
      this.yearIndex--;
    }
    this.calculateTotalNoOfDaysAndFirstDay();

  }
  counter(i: number) {
    return new Array(i);
  }

  calculateTotalNoOfDaysAndFirstDay() {
    this.totaldaysinMonth = new Date(this.years[this.yearIndex], this.monthIndex + 1, 0).getDate();
    this.daysInMonth = new Array();
    for (let i = 1; i <= this.totaldaysinMonth; i++) {
      this.daysInMonth[i - 1] = i;
    }
    this.firstDay = new Date(this.years[this.yearIndex], this.monthIndex, 1).getDay() - 1;
    this.firstDay = this.firstDay === -1 ? 6 : this.firstDay;
    this.firstDay = this.firstDay === 0 ? 0 : this.firstDay;
    if (this.currentDate.getMonth() === this.monthIndex && this.currentDate.getFullYear() === this.years[this.yearIndex]) {
      this.appYearAndMonth = true;
    } else {
      this.appYearAndMonth = false;
    }

  }

  getClickedDayAndCreateFullDate(day: number) {
    const outputDto = new SelectedDateDto();
    outputDto.familyToDoList = this.toDoLists;
    outputDto.selectedDate = new Date(this.years[this.yearIndex], this.monthIndex - 1, day + 1);
    this.outputObject.emit(outputDto);
  }

  init(data: Todolist[]) {
    this.toDoLists = data;
  }

  checkTasksForDay(dayNum: number) {
    if (this.toDoLists !== undefined) {
      let totalTasksForDay = 0;
      for (let i = 0; i < this.toDoLists.length; i++) {
        const taskDate = new Date(Date.parse(this.toDoLists[i].dueDate.toString()));
        const myDayString = this.years[this.yearIndex] + ' ' + this.monthIndex + ' ' + dayNum;
        const taskDateString = taskDate.getFullYear() + ' ' + (taskDate.getMonth() + 1) + ' ' + taskDate.getDate();
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

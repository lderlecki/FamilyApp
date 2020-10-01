import { Component, OnInit } from '@angular/core';

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
  selectedDate: Date;
  testDay: Date;
  monthsEng = ['January', 'February', ' March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthsPl = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
  years = [2020, 2021, 2022, 2023, 2024, 2025 , 2026, 2027];
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

  getClickedDayAndCreateFullDate(event: any) {
    this.selectedDate = new Date(this.years[this.yearIndex], this.monthIndex, event.target.innerText);
    alert('SELECTED DATE ' + this.selectedDate);

  }



}

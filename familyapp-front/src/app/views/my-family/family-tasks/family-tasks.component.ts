import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {InvitationService} from '../../../services/invitation.service';
import {Subscription} from 'rxjs';
import {FamilyService} from '../../../services/family.service';
import {CalendarComponent, SelectedDateDto} from '../../../components/calendar/calendar.component';
import {ToDoService} from '../../../services/to-do.service';
import {Todolist} from '../../../model/todolist';

@Component({
  selector: 'app-my-family',
  templateUrl: './family-tasks.component.html',
  styleUrls: ['./family-tasks.component.scss'],
  providers: [ProfileService, InvitationService],
})
export class FamilyTasksComponent implements OnInit {
  @ViewChild('myChild') private myChild: CalendarComponent;
  @ViewChild('toDoDetails') private toDoDetails: ElementRef;
  @ViewChild('closeIcon') private closeIcon: ElementRef;
  tableData: any;
  subscription: Subscription;
  myFamilyTasks: Todolist[];
  displayDate: string;
  toDoListsClickedDay: Todolist[];
  constructor(private familyService: FamilyService, private toDoService: ToDoService) {
  }


  ngOnInit(): void {
    this.subscription = this.familyService.getData().subscribe(data => {
      if (data?.id !== undefined) {
        this.toDoService.getToDosForFamily(data?.id).subscribe(response => {
          this.myFamilyTasks = response.body;
          setTimeout(() => {
              this.myChild.init(this.myFamilyTasks);
              document.getElementById('mySpinner').remove();
            }
            , 500);
        });

      }
    });
  }

  clickedDate(selectedDate: SelectedDateDto) {
    this.toDoDetails.nativeElement.style.opacity = '0.94';
    this.toDoDetails.nativeElement.style.height = '400px';
    this.toDoListsClickedDay = new Array<Todolist>();
    this.displayDate = selectedDate.selectedDate.toISOString().split('T')[0];
    for (let i = 0; i < selectedDate.familyToDoList.length; i++) {
      if (selectedDate.familyToDoList[i].dueDate.toString().split(' ')[0] === this.displayDate) {
        this.toDoListsClickedDay.push(selectedDate.familyToDoList[i]);
      }
    }
  }
  onScroll(event) {
    this.closeIcon.nativeElement.style.top = event.target.scrollTop + 'px';
  }
  closeMe() {
    this.toDoDetails.nativeElement.style.opacity = '0';
    this.toDoDetails.nativeElement.style.height = '0';
  }
// #TODO WRITE FUNCTIONALITY FOR FUNCTIONS BELOW
  changeTaskStatus(taskId: number) {
    alert('write functionality');
  }

  addNewTask() {
    alert('write functionality');
  }

  addNewToDo() {
  alert('write functionality');
  }
}

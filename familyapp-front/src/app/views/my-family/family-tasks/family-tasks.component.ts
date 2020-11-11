import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {InvitationService} from '../../../services/invitation.service';
import {Subscription} from 'rxjs';
import {FamilyService} from '../../../services/family.service';
import {CalendarComponent, SelectedDateDto} from '../../../components/calendar/calendar.component';
import {ToDoService} from '../../../services/to-do.service';
import {Todolist} from '../../../models/todolist';
import {FormBuilder} from "@angular/forms";

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
  myFamilyMembers;
  displayDate: string;
  toDoListsClickedDay: Todolist[];
  public showTaskForm = false;
  taskForm;
  private tempTodolist;

  constructor(
    private familyService: FamilyService,
    private toDoService: ToDoService,
    private formBuilder: FormBuilder
  ) {
    this.taskForm = this.formBuilder.group({
      name: '',
      description: '',
      profile: null,
      todolist: null,
    });
  }

  ngOnInit(): void {
    const data = this.familyService.familyValue;
    this.toDoService.getToDosForFamily(data?.id).subscribe(response => {
      this.myFamilyTasks = response.body;
      console.log(this.myFamilyTasks);
      setTimeout(() => {
          this.myChild.init(this.myFamilyTasks);
          document.getElementById('mySpinner').remove();
        }
        , 500);
    });
  }

  clickedDate(selectedDate: SelectedDateDto) {
    this.toDoDetails.nativeElement.style.opacity = '0.94';
    this.toDoDetails.nativeElement.style.height = '400px';
    this.toDoListsClickedDay = new Array<Todolist>();
    this.displayDate = selectedDate.selectedDate.toISOString().split('T')[0];
    for (let i = 0; i < selectedDate.familyToDoList.length; i++) {
      if (selectedDate.familyToDoList[i].dueDate.toString().split(' ')[0] === this.displayDate) {
        console.log('clicked date:');
        console.log(selectedDate);
        console.log(selectedDate.familyToDoList);
        console.log(selectedDate.familyToDoList[i]);
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

  changeTaskStatus(task) {
    this.toDoService.changeTaskStatus(task.id, task.done)
      .subscribe(response => {
        task.done = response.done;
      }, error => console.log(error));
  }

  showAddTaskForm(currentForm) {
    const taskForms = document.getElementsByClassName('task-form active');
    if (taskForms.length > 0) {
      this.taskForm.reset();
      taskForms[0].classList.remove('active');
    }
    currentForm.classList.add('active');
  }

  addNewTask(formValue, currentForm, todolist) {
    this.tempTodolist = todolist;

    if (formValue.profile === -1) {
      formValue.profile = null;
    }
    formValue.todolist = currentForm.id;

    // const tempTask = {
    //   id: 999999999,
    //   name: 'Temp task return',
    //   description: 'Description temp task',
    //   done: false,
    //   responsiblePerson: null
    // };

    this.toDoService.createTask(formValue).subscribe(
      (response) => {
        console.log(response);
        this.taskCreateSuccess(response, currentForm);
      }, error => console.log(error.message)
    );
    // this.taskCreateSuccess(tempTask, currentForm);
  }

  private taskCreateSuccess(newTask, taskForm) {
    this.tempTodolist.tasks.push(newTask);
    taskForm.classList.remove('active');
  }

  addNewToDo() {
    alert('write functionality');
  }

}




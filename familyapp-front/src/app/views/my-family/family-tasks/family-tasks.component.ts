import {Component, ElementRef, HostListener, Input, OnInit, QueryList, ViewChild} from '@angular/core';
import {ProfileService} from '../../../services/profile.service';
import {InvitationService} from '../../../services/invitation.service';
import {Subscription} from 'rxjs';
import {FamilyService} from '../../../services/family.service';
import {CalendarComponent, SelectedDateDto} from '../../../components/calendar/calendar.component';
import {ToDoService} from '../../../services/to-do.service';
import {Todolist} from '../../../models/todolist';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatExpansionPanel} from '@angular/material/expansion';
import {TranslateService} from "@ngx-translate/core";

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
  @ViewChild(MatExpansionPanel) pannels: QueryList<MatExpansionPanel>;
  tableData: any;
  subscription: Subscription;
  myFamilyTasks: Todolist[];
  myFamilyMembers;

  displayDate: string;
  toDoListsClickedDay: Todolist[];

  public showTaskForm = false;
  public taskForm: FormGroup;
  public todoForm: FormGroup;
  panelOpenState = false;
  private selectedDateTime: string;

  constructor(
    private familyService: FamilyService,
    private toDoService: ToDoService,
    private fb: FormBuilder,
    private translate: TranslateService,
  ) {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      profile: null,
      todolist: null,
    });
    this.initTodoForm();

  }

  ngOnInit(): void {
    const data = this.familyService.familyValue;
    this.myFamilyMembers = this.familyService.familyMembers

    this.toDoService.getToDosForFamily().subscribe(response => {
      this.myFamilyTasks = response.body;
      setTimeout(() => {
          this.myChild.init(this.myFamilyTasks);
          // document.getElementById('mySpinner').remove();
        }
        , 250);
    });
  }

  private initTodoForm() {
    this.todoForm = this.fb.group({
      family: null,
      name: ['', Validators.required],
      description: ['', Validators.required],
      due_date: null,
      tasks: this.fb.array([]),
    });
  }

  clickedDate(selectedDate: SelectedDateDto) {
    this.toDoDetails.nativeElement.style.opacity = '1';
    this.toDoDetails.nativeElement.style.height = 'auto';
    this.toDoListsClickedDay = new Array<Todolist>();
    this.selectedDateTime = selectedDate.selectedDate.toISOString();
    this.displayDate = this.selectedDateTime.split('T')[0];
    for (let i = 0; i < selectedDate.familyToDoList.length; i++) {
      if (selectedDate.familyToDoList[i].dueDate?.toString().split(' ')[0] === this.displayDate) {
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
    this.clearTodoForm();
  }

  private clearTodoForm() {
    const forms = document.getElementsByClassName('todo-form active');
    for (let i = 0; i < forms.length; i++) {
      forms[i].classList.remove('active');
    }
    this.todoForm.reset();
    this.initTodoForm();
    const btn = <HTMLElement>document.querySelector('.btn-show-form');
    btn.classList.remove('d-none');
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

  createTask(formValue, currentForm, todolist) {
    const taskTodolist = todolist;

    if (formValue.profile === -1) {
      formValue.profile = null;
    }
    formValue.todolist = currentForm.id;

    this.toDoService.createTask(formValue).subscribe(
      (response) => {
        console.log(response);
        this.taskCreateSuccess(response, currentForm, taskTodolist);
      }, error => console.log(error.message)
    );
  }

  private taskCreateSuccess(newTask, taskForm, taskTodolist) {
    taskTodolist.tasks.push(newTask);
    taskForm.classList.remove('active');
  }

  showTodoForm(form) {
    form.classList.add('active');
    const btn = <HTMLInputElement>document.querySelector('.btn-show-form');
    btn.classList.add('d-none');

  }

  createTodo(data) {
    if (!this.todoForm.valid) {
      const btn = <HTMLInputElement>document.querySelector('.todo-form-submit-btn');
      btn.disabled = true;
      return;
    }
    data['due_date'] = this.transformDueDate(data['due_date']);
    data['family'] = this.familyService.familyValue.id;
    console.log('form before post: ', data);
    this.toDoService.createTodolist(this.todoForm.value).subscribe(
      (response) => {
        this.todoCreateSuccess(response.body);
      }, error => console.log(error.message)
    );
    console.log('final form: ', this.todoForm.value);
  }

  todoCreateSuccess(newTodoData) {
    // TODO: Display response todolist in calendar
    this.myFamilyTasks.push(newTodoData);
    this.closeMe();
  }

  addNewTaskInTodo() {
    const control = <FormArray>this.todoForm.controls.tasks;
    control.push(
      this.fb.group({
        name: ['', Validators.required],
        profile: '',
        description: ['', Validators.required],
      })
    );
  }

  removeTask(i) {
    this.getTasksArray.removeAt(i);
  }

  getResponsiblePerson(task) {
    const profile = task.controls['profile'].value;
    if (profile !== -1 && profile !== '') {
      const member = this.myFamilyMembers.find(i => i.id === profile);
      return `${member.name} ${member.surname}`;
    }
    return this.translate.instant('TODO.EVERYONE');
  }

  get getTasksArray() {
    return this.todoForm.get('tasks') as FormArray;
  }

  private transformDueDate(date) {
    return [this.displayDate, date.toISOString().split('T')[1]].join('T');
  }

}

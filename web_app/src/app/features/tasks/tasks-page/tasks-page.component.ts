import { Component } from '@angular/core';
import { Tasks } from "../tasks/tasks.component";

@Component({
  selector: 'app-tasks-page',
  imports: [Tasks],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css',
})
export class TasksPage {

}

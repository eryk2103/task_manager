import { Component, input } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle, MatCardActions } from '@angular/material/card';

@Component({
  selector: 'app-alert',
  imports: [MatCard, MatCardHeader, MatCardContent, MatCardTitle, MatCardSubtitle, MatCardActions],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class Alert {
  title = input<string | null>(null);
}

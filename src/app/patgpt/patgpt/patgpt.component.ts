import { Component, OnInit } from '@angular/core';
import { ChatResponse } from 'app/model/chat-response';
import { PatgptService } from 'app/services/patgpt.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-patgpt',
  templateUrl: './patgpt.component.html',
  styleUrls: ['./patgpt.component.css']
})
export class PatgptComponent implements OnInit {

  userInput: string = '';
  chatResponse: ChatResponse | null = null;
  currentDate: Date = new Date();
  private intervalId: any;
  private URL4PATGPT: string = environment.URL4PATGPT;
  sendWithHistorical: boolean = false;
  public isLoading; boolean = false;

  constructor(private patgptService: PatgptService) { }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.currentDate = new Date();
    }, 1000);
  }

  sendQuestion() {
    this.isLoading = true;
    this.patgptService.getPatGptResponse(this.userInput, this.sendWithHistorical).subscribe(response => {
      this.isLoading = false;
      this.chatResponse = response;
    });
  }

  onUserInput(event: Event) {
    this.userInput = (event.target as HTMLTextAreaElement).value;
  }

  clearTextArea(): void {
    this.userInput = '';
  }

  navigateToHistorical(): void {
    window.open(this.URL4PATGPT + "h2-console", '_blank');
  }

  clearHistorical(): void {
    const response = confirm("Sure you want to delete historical ? ");
    if (response) {
      this.patgptService.delPatGptHistorical().subscribe(response => {
        alert("All Historical Deleted");
      });
    }
  }

}
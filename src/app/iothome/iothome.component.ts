import { Component, OnInit } from '@angular/core';
import { Member } from 'app/model/member';
import { IotService } from 'app/services/iot.service';
import { MembersService } from 'app/services/members.service';

@Component({
  selector: 'app-iothome',
  templateUrl: './iothome.component.html',
  styleUrls: ['./iothome.component.css']
})
export class IothomeComponent implements OnInit {

  public user: Member = this._memberService.getUser();
  iotResponse: string = '';
  iotTestResponse: string = '';
  messageVisible: boolean = false;
  messageTestVisible: boolean = false;

  constructor(private _memberService: MembersService, private _iotService: IotService) { }

  ngOnInit() {
  }

  openOrCLosePortail(): void {
    this._iotService.openOrClosePortail(this.user).subscribe(
      response => {
        this.iotResponse = response._body;
        this.messageVisible = true;

        // Masquer le message après 25 secondes (25 000 ms)
        setTimeout(() => {
          this.messageVisible = false;
          this.iotResponse = '';
        }, 25000);
      },
      error => {
        // En cas d'erreur
        this.iotResponse = error.message;
        this.messageVisible = true;

        // Masquer le message après 21 secondes (21 000 ms)
        setTimeout(() => {
          this.messageVisible = false;
          this.iotResponse = '';
        }, 21000);
      });
  }

  testEthernetShield(): void {
    this._iotService.testEThernetShield(this.user).subscribe(
      response => {
        console.log("Response from Arduino : " + JSON.stringify(response._body));
        this.iotTestResponse = response._body;
        this.messageTestVisible = true;

        // Masquer le message après 500 ms
        setTimeout(() => {
          this.messageTestVisible = false;
          this.iotTestResponse = '';
        }, 500);
      },
      error => {
        // En cas d'erreur
        this.iotTestResponse = error.message;
        this.messageTestVisible = true;

        // Masquer le message après 5 secondes (5 000 ms)
        setTimeout(() => {
          this.messageTestVisible = false;
          this.iotTestResponse = '';
        }, 5000);
      });
  }
}

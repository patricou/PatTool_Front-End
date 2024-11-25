import { Component, OnInit } from '@angular/core';
import { IotService } from 'app/services/iot.service';

@Component({
  selector: 'app-iothome',
  templateUrl: './iothome.component.html',
  styleUrls: ['./iothome.component.css']
})
export class IothomeComponent implements OnInit {

  iotResponse: string = '';
  iotTestResponse: string = '';
  messageVisible: boolean = false;
  messageTestVisible: boolean = false;


  constructor(private _iotService: IotService) { }

  ngOnInit() {
  }

  openOrCLosePortail(): void {
    this._iotService.openOrClosePortail().subscribe(
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

        // Masquer le message après 25 secondes (25 000 ms)
        setTimeout(() => {
          this.messageVisible = false;
          this.iotResponse = '';
        }, 21000);
      });
  }

  testEthernetShield(): void {
    this._iotService.testEThernetShield().subscribe(
      response => {
        console.log("Response from Arduino : " + JSON.stringify(response._body));
        this.iotTestResponse = response._body;
        this.messageTestVisible = true;

        // Masquer le message après 25 secondes (25 000 ms)
        setTimeout(() => {
          this.messageTestVisible = false;
          this.iotTestResponse = '';
        }, 2000);
      },
      error => {
        // En cas d'erreur
        this.iotTestResponse = error.message;
        this.messageTestVisible = true;

        // Masquer le message après 25 secondes (25 000 ms)
        setTimeout(() => {
          this.messageTestVisible = false;
          this.iotTestResponse = '';
        }, 5000);
      });
  }

}

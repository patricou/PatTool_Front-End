import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Evenement } from '../../model/evenement';
import { EvenementsService } from '../../services/evenements.service';

import { IMyOptions } from 'ngx-mydatepicker';
import { Member } from '../../model/member';

@Component({
	selector: 'update-evenement',
	templateUrl: './update-evenement.component.html',
	styleUrls: ['./update-evenement.component.css']
})
export class UpdateEvenementComponent implements OnInit {

	public evenement: Evenement = new Evenement(null, new Date(), "", new Date(), new Date(), new Date(), "Nouvel Evenement !!", "", "", "", [], new Date(), "", "", [], "", "", "", "", 0, 0, "public");
	//private today: Date = new Date();
	public myOptions: IMyOptions = {
		// other options...
		dateFormat: 'dd mmm yyyy',
		alignSelectorRight: false,
		markCurrentDay: true,
		disableUntil: {
			year: new Date().getFullYear(),
			month: new Date().getMonth() + 1,
			day: new Date().getDate() - 1
		},
		showWeekNumbers: true
	};
	// Initialized to specific date to run with ngx-mydatepicker
	public author: string;
	public beginEventDate: Object;
	public endEventDate: Object;
	public openInscriptionDate: Object;
	public closeInscriptionDate: Object;
	// change color for select placeholder 
	public typeColor: string = "rgb(70,74,76)";
	public diffColor: string = "rgb(70,74,76)";

	constructor(private _route: ActivatedRoute,
		private _evenementsService: EvenementsService,
		private _router: Router
	) { }

	ngOnInit() {
		let id: string = this._route.snapshot.params['id'];
		this._evenementsService.getEvenement(id).subscribe
			(evenement => {
				//console.log("EVenement : " + JSON.stringify(evenement));
				this.evenement = evenement;
				this.author = evenement.author.firstName + " " + evenement.author.lastName;
				this.beginEventDate = {
					date: {
						year: new Date(this.evenement.beginEventDate).getFullYear(),
						month: new Date(this.evenement.beginEventDate).getMonth() + 1,
						day: new Date(this.evenement.beginEventDate).getDate()
					}
				};
				this.openInscriptionDate = {
					date: {
						year: new Date(this.evenement.openInscriptionDate).getFullYear(),
						month: new Date(this.evenement.openInscriptionDate).getMonth() + 1,
						day: new Date(this.evenement.openInscriptionDate).getDate()
					}
				};
				this.endEventDate = {
					date: {
						year: new Date(this.evenement.endEventDate).getFullYear(),
						month: new Date(this.evenement.endEventDate).getMonth() + 1,
						day: new Date(this.evenement.endEventDate).getDate()
					}
				};
				this.closeInscriptionDate = {
					date: {
						year: new Date(this.evenement.closeInscriptionDate).getFullYear(),
						month: new Date(this.evenement.closeInscriptionDate).getMonth() + 1,
						day: new Date(this.evenement.closeInscriptionDate).getDate()
					}
				};
			}
			)
	}

	updateEvenement(fromform: any, isValid: boolean) {
		// this has to be done has the input field type of ngx-mydatepicker is not date but text.
		this.evenement.beginEventDate = new Date(fromform.beginEventDate.date.year, fromform.beginEventDate.date.month - 1, fromform.beginEventDate.date.day);
		this.evenement.endEventDate = new Date(fromform.endEventDate.date.year, fromform.endEventDate.date.month - 1, fromform.endEventDate.date.day);
		this.evenement.openInscriptionDate = new Date(fromform.openInscriptionDate.date.year, fromform.openInscriptionDate.date.month - 1, fromform.openInscriptionDate.date.day);
		this.evenement.closeInscriptionDate = new Date(fromform.closeInscriptionDate.date.year, fromform.closeInscriptionDate.date.month - 1, fromform.closeInscriptionDate.date.day);
		this.evenement.visibility = "public";
		// note  : it is perhaps bad but  fields eventname, map and comment are passed through 2 ways binding.    
		//console.log("Result : "+ JSON.stringify(this.evenement) + " " + isValid);
		this._evenementsService.putEvenement(this.evenement).subscribe(res => this._router.navigate(['even']), err => alert("Error when updating the Event" + err));
	}

}

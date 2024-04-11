import { Component, OnInit, HostListener, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';

import { Evenement } from '../../model/evenement';
import { MembersService } from '../../services/members.service';
import { Member } from '../../model/member';
import { Router } from '@angular/router';
import { WindowRefService } from '../../services/window-ref.service';
import { FileService } from '../../services/file.service';
import { Headers } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonvaluesService } from '../../services/commonvalues.service';
import { EvenementsService } from '../../services/evenements.service';

export enum KEY_CODE {
	RIGHT_ARROW = 39,
	LEFT_ARROW = 37
}

@Component({
	selector: 'home-evenements',
	templateUrl: './home-evenements.component.html',
	styleUrls: ['./home-evenements.component.css']
})
export class HomeEvenementsComponent implements OnInit, AfterViewInit {

	public evenements: Evenement[];
	public user: Member;
	public totalElements: number;
	public totalPages: number;
	public pageNumber: number = this._commonValuesService.getPageNumber();
	public elementsByPage: number = this._commonValuesService.getElementsByPage();
	public dataFIlter: string = this._commonValuesService.getDataFilter();
	public pages: number[];
	public visible: boolean
	@ViewChild('searchterm')
	public searchterm: ElementRef;

	constructor(private _evenementsService: EvenementsService,
		private _memberService: MembersService,
		private _fileService: FileService,
		private _router: Router,
		private _commonValuesService: CommonvaluesService) {
	}

	ngOnInit() {
		this.user = this._memberService.getUser();
		this.getEvents(this.dataFIlter);
	}

	ngAfterViewInit() {
		// used to not have to press enter when filter
		const eventObservable = Observable
			.fromEvent(this.searchterm.nativeElement, 'input')
			// .do(data => console.log(data))
			.debounceTime(700);

		eventObservable.subscribe(
			((data: any) => {
				this.pageNumber = 0;
				this._commonValuesService.setPageNumber(this.pageNumber);
				this.dataFIlter = data.target.value;
				this._commonValuesService.setDataFilter(this.dataFIlter);
				this.getEvents(this.dataFIlter);
			}),
			((err: any) => console.error(err)),
			() => console.log('complete')
		)
	}

	private waitForNonEmptyValue(): Promise<void> {
		return new Promise<void>((resolve) => {
			const checkValue = () => {
				if (this.user.id !== "") {
					resolve();
				} else {
					let now = new Date();
					console.log("This.user.id is still empty "+now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()+'.'+now.getMilliseconds());
					setTimeout(checkValue, 100); // Appeler checkValue de manière récursive après 100ms
				}
			};
			checkValue(); // Déclencher la première vérification
		});
	}

	// Get the evenements list with pagination
	public getEvents(data: any) {
		let searchString: string = "*";
		if (data !== "")
			searchString = data == "" ? "*" : data;

		this.waitForNonEmptyValue().then(() => {
			let now = new Date();
			
			console.log("4|------------------> This.user.id is no more null ( from HomeEvenementsComponent ) :", this.user.id + " at " +now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()+'.'+now.getMilliseconds());
			
			this._evenementsService
				.getEvents(searchString, this.pageNumber, this.elementsByPage, this.user.id)
				.subscribe(res => {
					this.evenements = res.content;
					this.totalElements = res.totalElements;
					this.totalPages = res.totalPages;
					this.pageNumber = res.number;
					this._commonValuesService.setPageNumber(this.pageNumber);
					this.pages = Array.from(Array(this.totalPages), (x, i) => i);
				},
					err => alert("Error when getting Events " + JSON.stringify(this.user))
				);
		});
	};

	public addMemberInEvent(evenement: Evenement) {
		//console.log("addMemberInEvent " + JSON.stringify(evenement));
		// put the user logged in the venemen as member
		evenement.members.push(this.user);
		// save the evenement ( does an Update )
		this._evenementsService.putEvenement(evenement).subscribe(
			res => // console.log("I participe return ok " ),
				err => alert("Error when deleting participant " + err));
	}

	public delMemberInEvent(evenement: Evenement) {
		//console.log("delMemberInEvent " + JSON.stringify(evenement));
		// put the user logged in the venemen as member    
		let members: Member[] = evenement.members;
		// remove the member
		evenement.members = members.filter(memb => !(memb.id == this.user.id));
		// save the evenement ( does an Update )
		this._evenementsService.putEvenement(evenement).subscribe(
			res => // console.log("I don't participe in evenement ok "),
				err => alert("Error when deleting participant " + err));
	}

	public delEvent(evenement: Evenement) {
		this._evenementsService.delEvenement(evenement.id)
			.subscribe(
				res => {  //  update evenements for screen update			
					this.getEvents(this.dataFIlter);
				},
				err => {
					console.log("Del evenement error : " + err);
					alert("Issue when deleting the event : " + err);
				}
			);
	}

	public updEvent(evenement: Evenement) {
		this._evenementsService.putEvenement(evenement)
			.subscribe(resp => // console.log("Update Status OK "),
				err => alert("Update Status Error : " + err));
	}

	public updateFileUploadedInEvent(evenement: Evenement) {
		this._evenementsService.put4FileEvenement(evenement)
			.subscribe(resp => // console.log("Delete file OK "),
				err => alert("Delete File Error : " + err));
	}
	// Pagination functions
	public changePage(page: number) {
		this.pageNumber = page;
		this.getEvents(this.dataFIlter);
	}
	public changePreviousPage() {
		if (this.pageNumber > 0) {
			this.pageNumber = this.pageNumber - 1;
			this._commonValuesService.setPageNumber(this.pageNumber);
			this.getEvents(this.dataFIlter);
		}
	}
	public changeNextPage() {
		if (this.pageNumber < this.totalPages - 1) {
			this.pageNumber = this.pageNumber + 1;
			this._commonValuesService.setPageNumber(this.pageNumber);
			this.getEvents(this.dataFIlter);
		}
	}
	public changeFiltre() {
		this.pageNumber = 0;
		this._commonValuesService.setPageNumber(this.pageNumber);
		this._commonValuesService.setElementsByPage(this.elementsByPage);
		this.getEvents(this.dataFIlter);
	}

	public clearFilter() {
		this.dataFIlter = "";
		this.changeFiltre();
	}

	// Allow to use arrow for pagination
	@HostListener('window:keyup', ['$event'])
	keyEvent(event: KeyboardEvent) {
		if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
			this.changeNextPage();
		}
		if (event.keyCode === KEY_CODE.LEFT_ARROW) {
			this.changePreviousPage();
		}
	}

	public checkVisibility(evenement: Evenement) {
		console.log(evenement.evenementName + " --> visibility : " + evenement.visibility);
		console.log(evenement.evenementName + " --> Author : " + JSON.stringify(evenement.author.id));
		console.log(evenement.evenementName + " --> Current user : " + this.user.id);
		console.log("visibility = " + (evenement.visibility === null || evenement.visibility === 'public') || (evenement.visibility === 'private' && evenement.author.id === this.user.id));
		this.visible = (evenement.visibility === null || evenement.visibility === 'public') || (evenement.visibility === 'private' && evenement.author.id === this.user.id);
	}
}

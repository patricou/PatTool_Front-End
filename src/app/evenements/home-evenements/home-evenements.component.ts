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
	@ViewChild('searchterm')
	public searchterm: ElementRef;

	constructor(private _evenementsService: EvenementsService,
		private _memberService: MembersService,
		private _fileService: FileService,
		private _router: Router,
		private _commonValuesService: CommonvaluesService) {
	}

	ngOnInit() {
		this.getEvents(this.dataFIlter);
		this.user = this._memberService.getUser();
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
	// Get the evenements list with pagination
	public getEvents(data: any) {
		let searchString: string = "*";
		if (data !== "")
			searchString = data == "" ? "*" : data;
		this._evenementsService
			.getEvents(searchString, this.pageNumber, this.elementsByPage)
			.subscribe(res => {
				this.evenements = res.content;
				this.totalElements = res.totalElements;
				this.totalPages = res.totalPages;
				this.pageNumber = res.number;
				this._commonValuesService.setPageNumber(this.pageNumber);
				this.pages = Array.from(Array(this.totalPages), (x, i) => i);
			},
				err => alert("Error when getting Events " + err)
			);

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
}

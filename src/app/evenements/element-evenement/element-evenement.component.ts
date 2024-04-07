import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { NgbModal, ModalDismissReasons, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { UploadedFile } from '../../model/uploadedfile';
import { Member } from '../../model/member';
import { Evenement } from '../../model/evenement';
import { environment } from '../../../environments/environment';
import { WindowRefService } from '../../services/window-ref.service';
import { FileService } from '../../services/file.service';

@Component({
	selector: 'element-evenement',
	templateUrl: './element-evenement.component.html',
	styleUrls: ['./element-evenement.component.css'],
	providers: [NgbRatingConfig]
})
export class ElementEvenementComponent implements OnInit, AfterViewInit {

	public uploader: FileUploader;
	public API_URL: string = environment.API_URL;
	public API_URL4FILE: string = environment.API_URL4FILE;
	// For firebase items
	public items: FirebaseListObservable<any[]>;
	public msgVal: string = '';
	// Evaluate rating
	public currentRate: number = 0;
	public safeUrlMap: SafeUrl;
	public safePhotosUrl: SafeUrl;
	// Native Window
	public nativeWindow: any;
	// Thumbnail image
	public thumbnailUrl: any = "assets/images/images.jpg";

	@Input()
	evenement: Evenement;

	@Input()
	user: Member;

	@Output()
	addMember: EventEmitter<Evenement> = new EventEmitter<Evenement>();

	@Output()
	delMember: EventEmitter<Evenement> = new EventEmitter<Evenement>();

	@Output()
	delEvenement: EventEmitter<Evenement> = new EventEmitter<Evenement>();

	@Output()
	updateEvenement: EventEmitter<Evenement> = new EventEmitter<Evenement>();

	@Output()
	updateFileUploaded: EventEmitter<Evenement> = new EventEmitter<Evenement>();

	constructor(
		private sanitizer: DomSanitizer,
		private _router: Router,
		private modalService: NgbModal,
		private af: AngularFireDatabase,
		private ratingConfig: NgbRatingConfig,
		private _fileService: FileService,
		private winRef: WindowRefService
	) {
		// Rating config 
		this.ratingConfig.max = 10;
		this.ratingConfig.readonly = true;
		this.nativeWindow = winRef.getNativeWindow();
	}

	ngOnInit() {
		// init the rate 
		this.currentRate = 0;
		if (this.evenement.ratingMinus != null) {
			let rateClick = this.evenement.ratingMinus + this.evenement.ratingPlus;
			if (rateClick !== 0) {
				this.currentRate = (this.evenement.ratingPlus) / rateClick * 10;
			}
		}
		// sanitize the map url & photoUrl
		this.safeUrlMap = this.sanitizer.bypassSecurityTrustResourceUrl(this.evenement.map);
		this.safePhotosUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.evenement.photosUrl);
		// Upload files
		this.uploader = new FileUploader({
			url: this.API_URL4FILE + this.user.id + "/" + this.evenement.id,
			headers: [{ name: 'Accept', value: 'application/json' }],
			autoUpload: true,
		});
		this.uploader.onErrorItem = (item, response, status, headers) => alert("Upload NOK " + response + " / " + status + " / " + JSON.stringify(headers));
		this.uploader.onSuccessItem = (item, fu, status, headers) => {
			let fileUploaded = JSON.parse(fu);
			this.evenement.fileUploadeds.push(fileUploaded);
			this.setThumbnailImage();
			//console.log("Upload OK " + this.evenement );
		};
		// for the firebase : create a collection with evenement.id as name 
		this.items = this.af.list(this.evenement.id, {
			query: {
				limitToLast: 75,
				orderByChild: 'priority'
			}
		});
		// Call Thumbnail Image function
		this.setThumbnailImage();
	}
	// Set image thumbnail
	public setThumbnailImage() {
		if (this.evenement.fileUploadeds.length != 0) {
			this.evenement.fileUploadeds.map(fileUploaded => {
				if (fileUploaded.fileName.indexOf('thumbnail') !== -1) {
					this.getFileBlobUrl(fileUploaded.fieldId).subscribe(blob => {
						console.log('blob type : ' + blob.type + " // blob.size : " + blob.size);
						let objectUrl = this.nativeWindow.URL.createObjectURL(blob);
						this.thumbnailUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
						let natw = this.nativeWindow;
						setTimeout(function () {
							console.log('Object revoked');
							natw.URL.revokeObjectURL(objectUrl);
						}, 5000);
					}
					);
				}
			}
			)
		};
	}
	// not used
	ngAfterViewInit() {
	}
	// delete a file uploaded linked to the evenement, update the evenement
	delFile(fieldId: string) {
		//console.log("File Id : " + fieldId);
		if (confirm("Are you sure you want to delete the file ? ")) {
			this.evenement.fileUploadeds = this.evenement.fileUploadeds.filter(fileUploaded => !(fileUploaded.fieldId == fieldId));
			this.updateFileUploaded.emit(this.evenement);
		}
	}
	// check if a map is available
	public isMapAvailable(): boolean {
		let b: boolean = !!this.evenement.map;
		// console.log("map is available " + b);
		return b;
	}
	// check if thur picture URL is available
	public isPhotosUrlAvailable(): boolean {
		let b: boolean = !!this.evenement.photosUrl;
		// console.log("map is available " + b);
		return b;
	}
	// call the modal window for del confirmation
	public deleteEvenement() {
		if (confirm("Are you sure you want to delete the event ? ")) {
			this.delEvenement.emit(this.evenement);
		}
	}
	// add the user as member
	public addMemberClick() {
		this.addMember.emit(this.evenement);
	};
	// del the user as member
	public delMemberClick() {
		this.delMember.emit(this.evenement);
	};
	// Change Status
	public changeStatusEvent(status: string) {
		if (status == "Closed") {
			this.evenement.status = "Cancel"
		} else
			if (status == "Cancel") {
				this.evenement.status = "Open"
			}
			else
				this.evenement.status = "Closed"

		this.updateEvenement.emit(this.evenement);
	};

	public isAuthor(): boolean {
		// i don't search by Id becoze sometimes the page can be diaplyed after the id is filled 
		// as it is completed by the id becoming from Mlab with an observable in membersService.completeMemberId()
		return this.evenement.author.userName == this.user.userName;
	}

	public isParticipant(): boolean {
		let b: boolean = false;
		this.evenement.members.forEach(member => {
			if (member.userName == this.user.userName) { b = true };
		}
		);
		return b;
	}

	public isAnyParticpants(): boolean {
		return this.evenement.members.length > 0;
	}

	public isAnyFiles(): boolean {
		return this.evenement.fileUploadeds.length > 0;
	}

	public isFileOwner(member: Member): boolean {
		let b: boolean = false;
		b = this.user.id == member.id
		return b;
	}
	// for modal chat
	public closeResult: string;

	public open(content) {
		this.modalService.open(content).result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
		}, (reason) => {
			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
		});
	}

	public getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}

	Send() 
	{     
	  this.items.push({
		'message': this.msgVal,
		'date': firebase.database.ServerValue.TIMESTAMP,
		'user': {
		  firstName: this.user.firstName,
		  lastName: this.user.lastName,
		  userName: this.user.userName
		},
		'priority': 0 - Date.now()
	  });
	  this.msgVal = '';
	}


	public deleteMessage(item) {
		this.items.remove(item.$key);
	}
	// for file list toogle
	public tfl: boolean = true;
	public toogleFileListe() {
		this.tfl = !this.tfl;
	}
	// Rate functions
	public addRatePlus() {
		this.evenement.ratingPlus = this.evenement.ratingPlus + 1;
		this.currentRate = (this.evenement.ratingPlus) / (this.evenement.ratingMinus + this.evenement.ratingPlus) * 10;
		this.updateEvenement.emit(this.evenement);
	};
	public addRateMinus() {
		this.evenement.ratingMinus = this.evenement.ratingMinus + 1;
		this.currentRate = (this.evenement.ratingPlus) / (this.evenement.ratingMinus + this.evenement.ratingPlus) * 10;
		this.updateEvenement.emit(this.evenement);
	}
	// Get the file url with the baerer token for authentifcation
	public getFileBlobUrl(fileId: string): Observable<any> {
		return this._fileService.getFile(fileId).map(res => {
			let ct: string = res.headers.get('Content-Type');
			let blob = new Blob([res._body], { type: ct + ";charset=utf-8" });
			return blob;
		});
	}
	// Open window when click on associate button
	public openWindows(fileId: string, fileName: string) {
		this.getFileBlobUrl(fileId).subscribe(blob => {
			console.log('blob type : ' + blob.type + " // blob.size : " + blob.size);
			//IE11 & Edge
			if ((navigator as any).msSaveBlob) {
				(navigator as any).msSaveBlob(blob, fileName);
			} else {
				let natw = this.nativeWindow;
				//In FF link must be added to DOM to be clicked
				let link = natw.document.createElement('a');
				let objectUrl = natw.URL.createObjectURL(blob);
				link.href = objectUrl;
				// this method allow to give a name to the file
				link.setAttribute('download', fileName);
				natw.document.body.appendChild(link);
				link.click();
				// remove the 				
				setTimeout(function () {
					console.log('Object revoked');
					natw.document.body.removeChild(link);
					natw.URL.revokeObjectURL(objectUrl);
				}, 5000);
			}
			//this.nativeWindow.open(objectUrl);
		}
		);
	}

}

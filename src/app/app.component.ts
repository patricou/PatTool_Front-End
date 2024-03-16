import { Component, OnInit } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { KeycloakService } from './keycloak/keycloak.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Member } from './model/member';
import { MembersService } from './services/members.service';
import { CommonvaluesService } from './services/commonvalues.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    public user: Member;

    constructor(public _translate: TranslateService,
        public _kc: KeycloakService,
        public _membersService: MembersService,
        public _commonValuesServices: CommonvaluesService,
        public modalService: NgbModal, ) {
    }

    ngOnInit() {
        this.getUserInfo();
        // init translator
        this._translate.addLangs(environment.langs);
        this._translate.setDefaultLang('en');
        // set the lang stored in the commnValue service
        this._translate.use(this._commonValuesServices.getLang());
        // catch in all modules when lang is changed

        this._translate.onLangChange.subscribe((event: LangChangeEvent) => {
            this._commonValuesServices.setLang(event.lang);
            //console.log("Change language : " + event.lang + " / c.v.s. getLang : " + this._commonValuesServices.getLang());
        });
    }

    logout() {
        // this.member = undefined;
        this._kc.logout();
    }

    isAuthenticated(): boolean {
        return this._kc.getAuth().authenticated;
    }

    getUserInfo() {
        //Retrieve user info from Keycloak
        this.user = this._kc.getUserAsMember();
        // Retrive the MLAB user (member) id from MLAB
        this._membersService.setUser(this.user);
        //this.user = this._membersService.getUser();
        // the folowing add the user.id and return it through an Observanle
        this._membersService.getUserId().subscribe(member => {
            this.user.id = member.id;
            // reset the user in the service ( with id ) otherwyse it is not present ( which is strange )
            this._membersService.setUser(this.user);
        },
            err => alert("Error when retieving MLB user id")
        );
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
}

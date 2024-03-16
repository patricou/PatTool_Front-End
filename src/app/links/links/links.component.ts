import { Component, OnInit } from '@angular/core';
import { Category } from 'app/model/Category';
import { urllink } from 'app/model/urllink';
import { CommonvaluesService } from 'app/services/commonvalues.service';
import { UrllinkService } from 'app/services/urllink.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  public urllinks: urllink[];
  public categories: Category[];

  constructor(private _urlLinkService: UrllinkService, private _commonValuesService: CommonvaluesService) { }

  ngOnInit() {
    // to get urls
    this._urlLinkService
      .getLinks()
      .subscribe(ulks => {
        //alert(JSON.stringify(ulks));
        this.urllinks = ulks;      
      }
        , err => alert("Error getting urllink" + err));
    // to get Categories  
    this._urlLinkService
      .getCategories()
      .subscribe(categ => {        
        this.categories = categ;       
      }
        , err => alert("Error getting Category" + err))
  };

  onClick() {    
  }

}

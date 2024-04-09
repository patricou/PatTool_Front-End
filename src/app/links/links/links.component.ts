import { Component, OnInit } from '@angular/core';
import { Category } from 'app/model/Category';
import { Member } from 'app/model/member';
import { urllink } from 'app/model/urllink';
import { CommonvaluesService } from 'app/services/commonvalues.service';
import { MembersService } from 'app/services/members.service';
import { UrllinkService } from 'app/services/urllink.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  public urllinks: urllink[];
  public categories: Category[];
  public user: Member = this._memberService.getUser();

  constructor(private _memberService: MembersService, private _urlLinkService: UrllinkService, private _commonValuesService: CommonvaluesService) { }

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

  submitVisibilityChange(urllink) {
    // Convert the visibility to 'public' or 'private'
    urllink.visibility = urllink.visibility === 'public' ? 'private' : 'public';

    // Call your service to update the visibility in the database
    this._urlLinkService.updateVisibility(urllink).subscribe(
      response => {
        // console.log('Visibility update successful', response);
      },
      error => {
        console.error('An error occurred while updating visibility', error);
        // Optionally, revert the visibility toggle in case of error

      }
    );
  }

  canEdit(u: urllink): boolean {
    return u.author.id === this.user.id;
  }

  isVisible(u: urllink): boolean {

    let v = u.author.id === this.user.id || u.visibility === 'public';
    return v;
  }


}

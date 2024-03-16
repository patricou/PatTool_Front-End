import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { HomeModule } from "./home/home.module";
import { EvenementsModule } from './evenements/evenements.module';
import { ChatModule } from './communications/communications.module';
import { MapsModule } from './other/other.module';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home/home-page/home-page.component';
import { HomeEvenementsComponent } from './evenements/home-evenements/home-evenements.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChatComponent } from './communications/chat/chat.component';
import { AboutComponent } from './other/about/about.component';
import { CreateEvenementComponent } from './evenements/create-evenement/create-evenement.component';
import { UpdateEvenementComponent } from './evenements/update-evenement/update-evenement.component';
import { KeycloakService } from './keycloak/keycloak.service';
import { KeycloakHttp } from './keycloak/keycloak.http';
import { MembersService } from './services/members.service';
import { CommonvaluesService } from './services/commonvalues.service';
import { FileService } from './services/file.service';
import { environment } from '../environments/environment';
import { LinksComponent } from './links/links/links.component';
import { LinksModule } from './links/links.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: Http) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	declarations: [
		AppComponent,
		PageNotFoundComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		HomeModule,
		EvenementsModule,
		ChatModule,
		MapsModule,
		LinksModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [Http]
			}
		}),
		RouterModule.forRoot([
			{ path: '', component: HomePageComponent },
			{ path: 'even', component: HomeEvenementsComponent },
			{ path: 'neweven', component: CreateEvenementComponent },
			{ path: 'updeven/:id', component: UpdateEvenementComponent },
			{ path: 'results', component: ChatComponent },
			{ path: 'maps', component: AboutComponent },
			{ path: 'links', component: LinksComponent },
			{ path: 'home', redirectTo: '', pathMatch: 'full' },
			{ path: '**', component: PageNotFoundComponent }
		]),
		FlexLayoutModule,
		NgbModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase, 'my-app-name'), // imports firebase/app needed for everything
		AngularFireDatabaseModule,
		AngularFireAuthModule,
	],
	providers: [
		KeycloakService,
		KeycloakHttp,
		MembersService,
		FileService,
		CommonvaluesService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

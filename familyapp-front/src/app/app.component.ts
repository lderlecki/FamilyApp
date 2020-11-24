import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TokenAuthService} from './services/tokenAuth.service';
import {Router} from '@angular/router';
import {Profile} from './models/profile';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  profile: Profile;
  @ViewChild('searchInput') private searchInput: ElementRef;

  constructor(
    private router: Router,
    public translate: TranslateService,
    public authService: TokenAuthService,
  ) {
    console.log('app component constructor');
    translate.addLangs(['en', 'fr', 'pl']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|pl/) ? browserLang : 'en');
    this.authService.userProfile.subscribe(x => this.profile = x);
  }

  navigateToSearchComponent() {
    this.router.navigate(['/search/' + this.searchInput.nativeElement.value + '/profiles']);
  }

}

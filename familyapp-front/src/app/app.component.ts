import {Component, OnInit} from '@angular/core';
import {TooltipPosition} from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TokenAuthService} from './services/tokenAuth.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  constructor(
    private router: Router,
    public translate: TranslateService,
    public authService: TokenAuthService,
  ) {
    translate.addLangs(['en', 'fr', 'pl']);
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|pl/) ? browserLang : 'en');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/account/login']);
  }

}

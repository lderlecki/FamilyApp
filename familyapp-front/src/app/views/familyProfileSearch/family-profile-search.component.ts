import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-family-profile-search',
  templateUrl: './family-profile-search.component.html',
  styleUrls: ['./family-profile-search.component.scss'],
})
export class FamilyProfileSearchComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  ngOnInit(): void {
  }
}

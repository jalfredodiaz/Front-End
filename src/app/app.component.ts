import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sindicato Japac';

  constructor() {
    if (environment.production) {
      let url = document.location.href;

      if (url.toUpperCase().indexOf('HTTPS') < 0) {
        document.location.href = url.replace('http', 'https');
      }
    }
  }

  ngOnInit(): void {

  }


}

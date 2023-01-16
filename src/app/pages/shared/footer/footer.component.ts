import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


// Services


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  fecha: Date;
  version = environment.version;

  constructor() {
    this.fecha = new Date();
  }

  ngOnInit(): void {

  }

}

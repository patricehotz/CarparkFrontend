import { Component, Injectable, OnInit } from '@angular/core';
import { Parkingspacegetresponse } from '../parkingspacegetresponse.model';
import { CarparkService } from '../carpark.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-parking-user',
  templateUrl: './parking-user.component.html',
  styleUrls: ['./parking-user.component.css'],
})
export class ParkingUserComponent implements OnInit {
  constructor(private cpService: CarparkService) {}

  parkingSpaces: Parkingspacegetresponse[] = [];

  async ngOnInit(): Promise<void> {
    this.parkingSpaces = await this.cpService.getAllParkingSpaces();

    this.parkingSpaces.sort(function (a, b) {
      return a.number - b.number;
    });
    this.parkingSpaces.sort(this.sortAlphabetical);
  }

  checkin(id: string) {
    console.log('checkin' + id);
  }

  checkout(id: string) {
    console.log('checkout' + id);
  }

  isFree(status: string) {
    return status == 'free';
  }

  sortAlphabetical(a: Parkingspacegetresponse, b: Parkingspacegetresponse) {
    let x = a.story.toLowerCase();
    let y = b.story.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }
}

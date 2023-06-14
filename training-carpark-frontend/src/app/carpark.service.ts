import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parkingspacegetresponse } from './parkingspacegetresponse.model';
import { lastValueFrom, Observable } from 'rxjs';
import { Parkingspacecheckoutresponse } from './parkingspacecheckoutresponse.model';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CarparkService {
  constructor(private http: HttpClient) {}

  rootURL = 'https://localhost:7161/v1/Spaces/';

  async getAllParkingSpaces(): Promise<Parkingspacegetresponse[]> {
    try {
      return await lastValueFrom(this.http.request<Parkingspacegetresponse[]>('GET', this.rootURL));
    } catch (response) {
      alert((response as any).error);
      return null as any;
    }
  }

  async checkinParkingSpace(id: string) {
    try {
      await lastValueFrom(this.http.request('POST', this.rootURL + id + '/checkin'));
    } catch (response) {
      alert((response as any).error);
      return null as any;
    }
  }

  async checkoutParkingSpace(id: string): Promise<Parkingspacecheckoutresponse> {
    try {
      return await lastValueFrom(this.http.request<Parkingspacecheckoutresponse>('POST', this.rootURL + id + '/checkout'));
    } catch (response) {
      alert((response as any).error);
      return null as any;
    }
  }

  async deleteParkingSpace(id: string): Promise<void> {
    try {
      await lastValueFrom(this.http.delete(this.rootURL + id));
    } catch (response) {
      alert((response as any).error);
      return null as any;
    }
  }

  async createParkingSpace(story: string, number: number): Promise<Parkingspacegetresponse> {
    try {
      return await lastValueFrom(this.http.request<Parkingspacegetresponse>('POST', this.rootURL, { body: { story: story, number: number } }));
    } catch (response) {
      alert((response as any).error);
      return null as any;
    }
  }
}

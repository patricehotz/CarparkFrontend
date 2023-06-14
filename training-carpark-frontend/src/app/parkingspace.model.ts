import { Time } from "@angular/common";

export interface Parkingspace {
    id: string;
    story: string;
    number: number;
    status: string;
    timestamp: Date;
    duration: Time;
    price: string;
}

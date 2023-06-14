export interface ParkingspaceView extends Point {
    id: string
    parkingspaceNumber: number
    status: string
    center: Center
}

export interface Point {
    x: number
    y: number
}

export interface Center extends Point{
    radius: number
}
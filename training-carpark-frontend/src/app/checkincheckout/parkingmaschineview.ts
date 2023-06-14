export interface ParkingmaschineView extends Point {
    center: Center
}

export interface Point {
    x: number
    y: number
}

export interface Center extends Point{
    radius: number
}
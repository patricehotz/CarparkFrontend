import { AfterViewInit, Injectable, Component, ElementRef, ViewChild, Inject } from '@angular/core';
import { ParkingspaceView } from './parkingspaceview';
import { ParkingmaschineView } from './parkingmaschineview';
import { CarparkService } from '../carpark.service';
import { Parkingspacegetresponse } from '../parkingspacegetresponse.model';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-checkincheckout',
  templateUrl: './checkincheckout.component.html',
  styleUrls: ['./checkincheckout.component.scss'],
})
export class CheckincheckoutComponent implements AfterViewInit {
  p4: any;
  anzahlParkplaetze = 10;
  anzahlStockwerke = 10;
  canvasbreite = 1;
  canvashoehe = 1;
  rand = 10;
  breite = 0;
  hoehe = 0;
  schraege = 0;
  carheight = 100;
  carwidth = 100;
  cars: HTMLDivElement[] = [];
  parkingSpacesView: ParkingspaceView[] = [];
  parkingCheckoutMaschine: ParkingmaschineView = null as any;
  img: any;
  parkingSpaces: Parkingspacegetresponse[] = [];
  story: string = null as any;
  stories: string[] = [];
  timeout: any = null;
  printingsound = new Audio('../../assets/PrintingSound.mp3');

  @ViewChild('parkingspaceCanvas')
  canvas: ElementRef<HTMLCanvasElement> = null as any;
  ctx: CanvasRenderingContext2D = null as any;

  constructor(@Inject(CarparkService) private cpService: CarparkService) {}

  async ngAfterViewInit(): Promise<void> {
    this.canvasbreite = this.canvashoehe = document.documentElement.clientHeight * window.devicePixelRatio;
    this.rand = 100;
    this.parkingSpaces = await this.cpService.getAllParkingSpaces();
    this.parkingSpaces.sort(function (a, b) {
      return a.number - b.number;
    });
    this.parkingSpaces.sort(this.sortAlphabetical);

    this.parkingSpaces.forEach((parkingSpace) => {
      if (this.stories.find((x) => x == parkingSpace.story) == undefined) {
        this.stories.push(parkingSpace.story);
      }
    });

    this.story = this.stories[0];
    this.renderCarParkStory();
  }

  public async renderCarParkStory(story?: string): Promise<void> {
    if (story == undefined) {
      story = this.story;
    }
    this.parkingSpaces = await this.cpService.getAllParkingSpaces();
    this.parkingSpaces.sort(function (a, b) {
      return a.number - b.number;
    });
    this.parkingSpaces.sort(this.sortAlphabetical);

    this.ctx = this.canvas.nativeElement.getContext('2d') as any;

    let animationduration = 0.5;
    this.switchStoryAnimation(story, animationduration);
    await this.delay(animationduration * 1000 * 0.4);

    this.ctx.clearRect(0, 0, this.canvasbreite, this.canvashoehe);
    document.querySelectorAll('.car').forEach((x) => x.remove());
    document.querySelectorAll('.parkingmaschine').forEach((x) => x.remove());
    document.getElementById('ticketmaschinecontainer')?.remove();
    this.parkingSpacesView = [];
    this.cars = [];

    this.story = story;

    document.querySelectorAll('.stories').forEach((x) => {
      if (x.getAttribute('id') == story) {
        x.setAttribute('active', 'true');
      } else {
        x.setAttribute('active', 'false');
      }
    });

    this.createParkingSpaces(story);
    this.createCars(story);
    this.createParkingMaschine(this.canvasbreite, 20 + this.hoehe);
    this.createCar(this.canvasbreite, 20);
  }

  delay(miliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, miliseconds);
    });
  }

  public switchStoryAnimation(storyToSwitch: string, animationTimeInSeconds: number) {
    clearTimeout(this.timeout);
    let mainCanvas = document.getElementById('maincanvas') as any;
    mainCanvas.opacity = 0;
    mainCanvas.style.animation = ``;
    mainCanvas.opacity = 1;
    let reverse = this.stories.indexOf(storyToSwitch) - this.stories.indexOf(this.story) < 0;

    mainCanvas.style.animation = `switchStory ${animationTimeInSeconds}s 1 ${reverse ? 'reverse' : 'normal'}`;

    this.timeout = setTimeout(() => {
      mainCanvas.style.animation = ``;
    }, animationTimeInSeconds * 1000);
  }

  public drawParkingspace(x: number, y: number) {
    this.ctx.beginPath();

    //linie Oben
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + this.breite, y);

    //linie Rechts
    this.ctx.lineTo(x + this.schraege + this.breite, y + this.hoehe);

    //linie Unten
    this.ctx.lineTo(x + this.schraege, y + this.hoehe);

    //linie Links
    this.ctx.lineTo(x, y);

    this.ctx.closePath();
    this.ctx.fillStyle = 'rgb(180, 180, 180)';
    this.ctx.fill();
    this.ctx.lineWidth = 6.0;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = 'rgb(249, 215, 28)';
    this.ctx.stroke();
  }

  public drawNumber(x: number, y: number, number: number) {
    //berechne winkel in welchem die schrifft dargestellt werden soll
    let winkel = (90 - Math.atan(this.hoehe / this.schraege) * (180 / Math.PI) - 90) * (Math.PI / 180);

    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.strokeStyle = 'rgb(0, 0, 0)';
    this.ctx.lineWidth = 1;
    this.ctx.font = '30px Arial';

    this.ctx.save();

    this.ctx.translate(x + 6, y + 6);
    this.ctx.rotate(-winkel);
    this.ctx.strokeText(number.toString(), 0, 0);
    this.ctx.fillText(number.toString(), 0, 0);

    this.ctx.restore();
  }

  public createParkingSpace(x: number, y: number, id: string, number: number, status: string) {
    this.drawParkingspace(x, y);
    this.drawNumber(x, y, number);

    let parkingSpace: ParkingspaceView = {
      id: id,
      parkingspaceNumber: number,
      status: status,
      x: x,
      y: y,
      center: {
        x: x + this.breite * 0.5 + this.schraege * 0.5,
        y: y + this.hoehe * 0.5,
        radius: Math.min(this.breite, this.hoehe),
      },
    };

    return parkingSpace;
  }

  public createParkingSpaces(story: string) {
    let parkingSpacesFromStory = this.parkingSpaces.filter((x) => x.story == story);
    let anzahl = parkingSpacesFromStory.length;
    let anzahlElemente = Math.ceil(Math.sqrt(anzahl));

    let anzahlReihen = Math.ceil(anzahl / anzahlElemente);

    this.schraege = this.canvasbreite / 40;
    this.breite = (this.canvasbreite - 2 * this.rand) / anzahlElemente - this.schraege;
    this.hoehe = (this.canvashoehe - 2 * this.rand) / anzahlReihen;
    this.carwidth = this.carheight = this.breite * 0.75;

    let index = 0;

    for (let i = 0; i < anzahlReihen; i++) {
      for (let j = 0; j < anzahlElemente; j++) {
        if (index < anzahl) {
          this.parkingSpacesView.push(this.createParkingSpace(this.rand + this.schraege * i + j * this.breite, this.rand + i * this.hoehe, parkingSpacesFromStory[index].id, parkingSpacesFromStory[index].number, parkingSpacesFromStory[index].status));
          index++;
        }
      }
    }
  }

  public async checkinParkingSpace(parkingSpace: ParkingspaceView) {
    let car = this.createCar(parkingSpace.center.x - this.carwidth / 2, parkingSpace.center.y - this.carheight / 2, this.parkingSpacesView[this.parkingSpacesView.indexOf(parkingSpace)].id);
    this.parkingSpacesView[this.parkingSpacesView.indexOf(parkingSpace)].status = 'occupied';
    await this.cpService.checkinParkingSpace(car.id);
  }

  public async checkoutParkingSpace(parkingSpace: ParkingspaceView, srcElement: any) {
    document.querySelectorAll('.car').forEach((x) => {
      if (x.id != '') {
        x.remove();
      }
    });
    this.parkingSpacesView[this.parkingSpacesView.indexOf(parkingSpace)].status = 'free';
    this.cars.splice(this.cars.indexOf(srcElement));
    srcElement.remove();
    let response = await this.cpService.checkoutParkingSpace(parkingSpace.id);
    this.showTicketMaschine(response.duration, response.price);
  }

  public createCars(story: string) {
    this.parkingSpacesView.filter((x) => x.status == 'occupied').forEach((x) => this.createCar(x.center.x - this.carwidth / 2, x.center.y - this.carheight / 2, x.id));
  }

  public createCar(x: number, y: number, id: string = ''): HTMLDivElement {
    let car = document.createElement('div');

    car.setAttribute('draggable', 'true');
    car.className = 'car';
    car.style.top = y + 'px';
    car.style.left = x + 'px';
    car.style.height = this.carheight + 'px';
    car.style.width = this.carwidth + 'px';
    car.setAttribute('id', id);

    this.cars.push(car);

    this.cars.forEach((car) => {
      if (car.id == '') {
        document.getElementById('checkincheckoutcontainer')?.appendChild(car);
      } else {
        document.getElementById('maincanvas')?.appendChild(car);
      }

      document.querySelectorAll('.car').forEach((item) => {
        item.addEventListener('dragstart', this.handleDragStart);
        item.addEventListener('dragend', this.handleDragEnd);
      });
    });

    return car;
  }

  public getParkingSpace(id: string) {
    return this.parkingSpacesView
      .map((parkingSpace) => {
        if (parkingSpace.id == id) {
          return parkingSpace;
        } else {
          return undefined;
        }
      })
      .find((x) => x != undefined);
  }

  public carInParkingSpace(x: number, y: number) {
    return this.parkingSpacesView
      .map((parkingSpace) => {
        if (Math.abs(parkingSpace.center.x - x) < parkingSpace.center.radius && Math.abs(parkingSpace.center.y - y) < parkingSpace.center.radius) {
          return parkingSpace;
        } else {
          return undefined;
        }
      })
      .find((x) => x != undefined);
  }

  public createParkingMaschine(x: number, y: number) {
    let parkingmaschine = document.createElement('div');
    parkingmaschine.className = 'parkingmaschine';
    parkingmaschine.style.top = y + 'px';
    parkingmaschine.style.left = x + 'px';
    parkingmaschine.style.height = this.carheight + 'px';
    parkingmaschine.style.width = this.carwidth + 'px';
    let parkingMaschine: ParkingmaschineView = {
      x: x,
      y: y,
      center: {
        x: x + this.carwidth * 0.5,
        y: y + this.carheight * 0.5,
        radius: Math.min(this.carheight / 2, this.carwidth / 2),
      },
    };
    this.parkingCheckoutMaschine = parkingMaschine;

    document.getElementById('checkincheckoutcontainer')?.appendChild(parkingmaschine);
  }

  public carInCheckoutArea(x: number, y: number) {
    return Math.abs(x - this.parkingCheckoutMaschine.center.x) <= this.parkingCheckoutMaschine.center.radius && Math.abs(y - this.parkingCheckoutMaschine.center.y);
  }

  message(text: string) {
    let submitbutton = document.createElement('button');
    submitbutton.className = 'submitbutton';
    submitbutton.innerHTML += 'Ok';
    submitbutton.onclick = this.Ok;

    let msgBox = document.createElement('div');
    msgBox.className = 'error';
    msgBox.innerHTML += text;

    msgBox.appendChild(submitbutton);

    let msgBoxBackground = document.createElement('div');
    msgBoxBackground.className = 'errorbackground';

    document.getElementById('mainContainer')?.appendChild(msgBox);
    document.getElementById('mainContainer')?.appendChild(msgBoxBackground);
  }

  Ok() {
    let error = document.getElementsByClassName('error');
    let errorBackground = document.getElementsByClassName('errorbackground');

    for (let i = 0; i < error.length; i++) {
      error[i].parentNode?.removeChild(error[i]);
    }
    for (let i = 0; i < errorBackground.length; i++) {
      errorBackground[i].parentNode?.removeChild(errorBackground[i]);
    }
  }

  public handleDragStart(e: any) {
    e.target.style.opacity = '1';
  }

  public handleDragEnd = (e: any) => {
    let offsets = document.getElementById('maincanvas')?.getBoundingClientRect();
    let offsetX = offsets?.left as any;
    let offsesY = offsets?.top as any;
    let x = e.x - offsetX;
    let y = e.y - offsesY;
    let parkingSpace = this.carInParkingSpace(x + 0.5 * this.carwidth, y + 0.5 * this.carheight);
    if (parkingSpace != undefined) {
      if (parkingSpace.status == 'occupied') {
        this.message('This parking space is already occupied. Choose another parking space');
      } else {
        this.checkinParkingSpace(parkingSpace);
      }
    } else if (this.carInCheckoutArea(x, y)) {
      let parkingSpace = this.getParkingSpace(e.srcElement.attributes.id.value);
      if (parkingSpace == undefined) {
        this.message('This car cant be checkouted');
      } else {
        this.checkoutParkingSpace(parkingSpace, e.srcElement);
      }
    }
    e.target.style.opacity = '1';
  };

  public sortAlphabetical(a: Parkingspacegetresponse, b: Parkingspacegetresponse) {
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

  public showTicketMaschine(duration: string, price: string) {
    var ticketmaschinecontainer = document.createElement('div');
    ticketmaschinecontainer.id = 'ticketmaschinecontainer';

    var ticketmaschine = document.createElement('div');
    ticketmaschine.className = 'ticketmaschine';

    var ticketmaschinescreen = document.createElement('div');
    ticketmaschinescreen.className = 'ticketmaschinescreen';

    var text1 = document.createElement('p');
    text1.className = 'ticketmaschinetext';
    text1.innerHTML += `Duration: ${duration}h`;

    var text2 = document.createElement('p');
    text2.className = 'ticketmaschinetext';
    text2.innerHTML += `Price: ${price}`;

    this.printingsound.play();
    setTimeout(() => {
      ticketmaschinescreen.appendChild(text1);
      setTimeout(() => {
        ticketmaschinescreen.appendChild(text2);
        setTimeout(() => {
          ticketmaschinecontainer.onclick = () => {
            this.createCars(this.story);
            ticketmaschinecontainer.remove();
          };
        }, 500);
      }, 500);
    }, 2000);
    ticketmaschine.appendChild(ticketmaschinescreen);
    document.getElementById('mainContainer')?.appendChild(ticketmaschinecontainer);
    document.getElementById('ticketmaschinecontainer')?.appendChild(ticketmaschine);
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { CarparkService } from '../carpark.service';
import { Parkingspacegetresponse } from '../parkingspacegetresponse.model';

@Component({
  selector: 'app-parking-manager',
  templateUrl: './parking-manager.component.html',
  styleUrls: ['./parking-manager.component.scss'],
})
export class ParkingManagerComponent implements OnInit {
  constructor(private cpService: CarparkService) {}

  stories: string[] = [];
  storiesParkingspacesMap: Map<string, Parkingspacegetresponse[]> = new Map<string, Parkingspacegetresponse[]>();
  showAddParkingSpaceView: boolean = false;

  story: string = 'a';
  number: number = null as any;
  suggestedNumber: number = null as any;

  async ngOnInit(): Promise<void> {
    let parkingSpaces = await this.cpService.getAllParkingSpaces();

    parkingSpaces.sort(function (a, b) {
      return a.number - b.number;
    });
    parkingSpaces.sort(this.sortAlphabetical);

    parkingSpaces.forEach((parkingSpace) => {
      if (this.stories.find((x) => x == parkingSpace.story) == undefined) {
        this.stories.push(parkingSpace.story);
      }
    });

    this.stories.forEach((story) => {
      this.storiesParkingspacesMap.set(
        story,
        parkingSpaces.filter((x) => x.story == story)
      );
    });

    window.addEventListener('keydown', (event) => {
      if (event.key == 'Escape') {
        this.showAddParkingSpaceView = false;
      }
    });
  }

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
  delay(miliseconds: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, miliseconds);
    });
  }

  public editParkingSpace() {
    alert('coming soon...');
  }

  public deleteParkingSpace(id: string) {
    console.log(Array.from(this.storiesParkingspacesMap.entries()));

    Array.from(this.storiesParkingspacesMap.entries()).forEach((x) => {
      let index = x[1].findIndex((y) => y.id == id);
      console.log('index', index);
      if (index >= 0) {
        console.log(x[1].length);

        x[1].splice(index, 1);

        console.log(x[1].length);

        if (x[1].length < 1) {
          this.storiesParkingspacesMap.delete(x[0]);
        }
      }
    });

    this.cpService.deleteParkingSpace(id);
  }

  public async addParkingSpaceButtonPressed(story: string) {
    this.story = story;
    this.showAddParkingSpaceView = true;
    let parkingSpaces = this.storiesParkingspacesMap.get(story) as any[];

    const index = parkingSpaces.map((x, index) => [x.number, index]).filter(([key, index]) => index + 1 != key)[0];

    if (index) {
      this.suggestedNumber = index[1] + 1;
    } else {
      this.suggestedNumber = parkingSpaces.length + 1;
    }

    this.number = this.suggestedNumber;

    await this.delay(50);

    const inputNumber = document.getElementById('number') as any;
    inputNumber.focus();
    inputNumber.select();
  }

  public async addParkingSpace(story: string, number: number) {
    this.showAddParkingSpaceView = false;
    let parkingSpace = await this.cpService.createParkingSpace(story, number);
    console.log(parkingSpace);

    if (Array.from(this.storiesParkingspacesMap.keys()).find((x) => x == parkingSpace.story) == undefined) {
      this.storiesParkingspacesMap.set(parkingSpace.story, Array.of(parkingSpace));

      await this.delay(100);

      let accordions = Array.from(document.getElementsByClassName('accordion'));
      console.log(accordions);

      this.setAccordion(accordions[accordions.length - 1]);
    } else {
      this.storiesParkingspacesMap.get(story)?.push(parkingSpace);
    }

    Array.from(this.storiesParkingspacesMap.entries()).forEach((x) => {
      x[1].sort(function (a, b) {
        return a.number - b.number;
      });
      x[1].sort(this.sortAlphabetical);
    });
  }

  public updateNumber(event: any) {
    this.number = event.target.value;
  }

  public updateStory(event: any) {
    this.story = event.target.value;
  }

  public setAccordion(accordion: any) {
    let panel = accordion.nextElementSibling;
    accordion.classList.toggle('active');
    let activeAccordions = Array.from(document.getElementsByClassName('active'));

    if (activeAccordions.length > 1) {
      for (let i = 0; i <= activeAccordions.length; i++) {
        activeAccordions[i]?.classList.toggle('active');
        activeAccordions[i]?.nextElementSibling?.setAttribute('style', 'max-height: null');
        accordion.classList.toggle('active');
      }
    }

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      let height = 0;
      panel.childNodes.forEach((x: HTMLDivElement) => {
        height += x.clientHeight || 0;
      });

      panel.style.maxHeight = 100 / document.getElementsByClassName('accordion').length + 'vh';
    }
  }

  public submitAddParkingSpace(event: KeyboardEvent, story: string, number: number) {
    if (event.key == 'Enter') {
      this.addParkingSpace(story, number);
    }
  }
}

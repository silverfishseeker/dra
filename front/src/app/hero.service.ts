import { Injectable } from '@angular/core';
import { Hero, Power } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private messageService: MessageService) { }
  
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<Hero> {
    const hero = HEROES.find(h => h.id === id);
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero as Hero);
  }

  getPowers(id: number): Observable<Power[]> {

    const powers = [
      { name: 'Muy buenas' },
      { name: 'Haha saludos' },
      { name: 'Poder de fuego infernal' },
      { name: 'Elástico'}
    ];
    this.messageService.add('HeroService: fetched powers id=${id}');
    return of(powers as Power[]);
  }
}

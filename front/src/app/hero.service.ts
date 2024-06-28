import { Injectable } from '@angular/core';
import { Hero, Power } from './hero';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'http://localhost:8080/api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error.message);
      console.info(`URL: ${this.heroesUrl}`);
      console.log();
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  
  getHeroes(): Observable<Hero[]> {
    return this.http.get<any>(this.heroesUrl)
    .pipe(
      map(response => response._embedded.heroes), 
      tap(_ => this.log(`fetched heroes `)),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  getPowers(id: number): Observable<Power[]> {
    const url = `${this.heroesUrl}/${id}/powers`;
    return this.http.get<any>(url)
    .pipe(
      map(response => response._embedded.powers), 
      tap(_ => this.log(`fetched powers for hero id=${id}`)),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero, powers: Power[]): Observable<any> {
    const updateHeroUrl = `${this.heroesUrl}/${hero.id}`;
    const updateHero$ = this.http.put(updateHeroUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );

    const updatePowersUrl = `${this.heroesUrl}/${hero.id}/powers`;
    const updatePowers$ = this.http.put(updatePowersUrl, powers, this.httpOptions).pipe(
      tap(_ => this.log(`updated powers for hero id=${hero.id}`)),
      catchError(this.handleError<any>('updatePowers')));

    return forkJoin([updateHero$, updatePowers$]);

  }
}

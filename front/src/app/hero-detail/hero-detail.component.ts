import { Component } from '@angular/core';
import { NgIf, UpperCasePipe, Location, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hero, Power } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [NgIf, NgFor, UpperCasePipe, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent {
  hero: Hero | undefined;
  powers: { name: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
    this.getPowers();
  }

  getIdParam(): number{
    return Number(this.route.snapshot.paramMap.get('id'));
  }

  getHero(): void {
    this.heroService.getHero(this.getIdParam()).subscribe(hero => this.hero = hero);
  }

  getPowers(): void {
    this.heroService.getPowers(this.getIdParam()).subscribe((powers: Power[]) => this.powers = powers);
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero, this.powers)
        .subscribe(() => this.goBack());
    }
  }

  goBack(): void {
    this.location.back();
  }
}

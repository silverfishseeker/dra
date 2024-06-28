package es.ual.heroesapp.controller;

import es.ual.heroesapp.model.Hero;
import es.ual.heroesapp.model.Power;
import es.ual.heroesapp.repository.HeroRepository;
import es.ual.heroesapp.repository.PowerRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/heroes")
@CrossOrigin(origins = "http://localhost:4200")
public class HeroController {

    @Autowired
    private HeroRepository heroRepository;

    @Autowired
    private PowerRepository powerRepository;

    @GetMapping
    public List<Hero> getAllHeroes() {
        return heroRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hero> getHeroById(@PathVariable Long id) {
        Optional<Hero> hero = heroRepository.findById(id);
        return hero.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Hero> createHero(@RequestBody Hero hero) {
        Hero savedHero = heroRepository.save(hero);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHero);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHero(@PathVariable Long id) {
        heroRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    @PostMapping("/{heroId}/powers")
    public ResponseEntity<Hero> addPowerToHero(@PathVariable Long heroId, @RequestBody Power power) {
        Optional<Hero> optionalHero = heroRepository.findById(heroId);
        if (optionalHero.isPresent()) {
            Hero hero = optionalHero.get();
            power.setHero(hero);
            powerRepository.save(power);
            hero.getPowers().add(power);
            heroRepository.save(hero);
            return ResponseEntity.ok(hero);
        } else {
            throw new EntityNotFoundException("Hero not found with id: " + heroId);
        }
    }

    @Transactional
    @DeleteMapping("/{heroId}/powers/{powerId}")
    public ResponseEntity<Void> removePowerFromHero(@PathVariable Long heroId, @PathVariable Long powerId) {
        Optional<Hero> optionalHero = heroRepository.findById(heroId);
        if (optionalHero.isPresent()) {
            Hero hero = optionalHero.get();
            Set<Power> powers = hero.getPowers();
            powers.removeIf(power -> power.getId().equals(powerId));
            heroRepository.save(hero);
            powerRepository.deleteById(powerId);
            return ResponseEntity.noContent().build();
        } else {
            throw new EntityNotFoundException("Hero not found with id: " + heroId);
        }
    }

    @Transactional
    @PutMapping("/{heroId}/powers")
    public ResponseEntity<Hero> updatePowersOfHero(@PathVariable Long heroId, @RequestBody Set<Power> updatedPowers) {
        Optional<Hero> optionalHero = heroRepository.findById(heroId);
        if (optionalHero.isPresent()) {
            Hero hero = optionalHero.get();
            // Eliminar poderes existentes y actualizar con los nuevos
            hero.getPowers().clear();
            updatedPowers.forEach(power -> {
                power.setHero(hero);
                powerRepository.save(power);
                hero.getPowers().add(power);
            });
            heroRepository.save(hero);
            return ResponseEntity.ok(hero);
        } else {
            throw new EntityNotFoundException("Hero not found with id: " + heroId);
        }
    }
}

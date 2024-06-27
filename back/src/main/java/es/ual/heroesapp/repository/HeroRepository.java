package es.ual.heroesapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import es.ual.heroesapp.model.Hero;

@Repository
public interface HeroRepository extends JpaRepository<Hero, Long> {
}

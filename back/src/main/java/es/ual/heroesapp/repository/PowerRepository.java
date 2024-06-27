package es.ual.heroesapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import es.ual.heroesapp.model.Power;

@Repository
public interface PowerRepository extends JpaRepository<Power, Long> {
}

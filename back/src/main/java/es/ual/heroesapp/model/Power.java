package es.ual.heroesapp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
    
@Entity
public class Power {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "hero_id")
    @JsonIgnore
    private Hero hero;

    // Getters and setters, constructor, and other methods

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Hero getHero() {
        return hero;
    }

    public void setHero(Hero hero) {
        this.hero = hero;
    }
}

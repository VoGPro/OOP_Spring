package com.example.carmanagement.controller;

import com.example.carmanagement.dto.CarDTO;
import com.example.carmanagement.service.CarService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    private final CarService carService;

    @Autowired
    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<Page<CarDTO>> getCars(
            @RequestParam(required = false) String vin,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            Pageable pageable) {
        return ResponseEntity.ok(carService.getCars(vin, brand, model, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        return ResponseEntity.ok(carService.getCarById(id));
    }

    @PostMapping
    public ResponseEntity<CarDTO> createCar(@Valid @RequestBody CarDTO carDTO) {
        return ResponseEntity.ok(carService.createCar(carDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarDTO carDTO) {
        return ResponseEntity.ok(carService.updateCar(id, carDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok().build();
    }
}
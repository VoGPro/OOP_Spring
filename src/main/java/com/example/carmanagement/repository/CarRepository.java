package com.example.carmanagement.repository;

import com.example.carmanagement.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CarRepository extends JpaRepository<Car, Long>, JpaSpecificationExecutor<Car> {
    boolean existsByVinIgnoreCase(String vin);
    boolean existsByVinIgnoreCaseAndIdNot(String vin, Long id);
}
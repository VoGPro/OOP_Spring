package com.example.carmanagement.service;

import com.example.carmanagement.dto.CarDTO;
import com.example.carmanagement.entity.Car;
import com.example.carmanagement.exception.CarNotFoundException;
import com.example.carmanagement.exception.DuplicateVinException;
import com.example.carmanagement.repository.CarRepository;
import com.example.carmanagement.specification.CarSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CarService {
    private final CarRepository carRepository;

    @Autowired
    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Transactional(readOnly = true)
    public Page<CarDTO> getCars(String vin, String brand, String model, Pageable pageable) {
        Specification<Car> spec = Specification.where(null);

        if (vin != null && !vin.isEmpty()) {
            spec = spec.and(CarSpecification.vinContains(vin));
        }
        if (brand != null && !brand.isEmpty()) {
            spec = spec.and(CarSpecification.brandEquals(brand));
        }
        if (model != null && !model.isEmpty()) {
            spec = spec.and(CarSpecification.modelEquals(model));
        }

        return carRepository.findAll(spec, pageable).map(this::convertToDTO);
    }

    @Transactional(readOnly = true)
    public CarDTO getCarById(Long id) {
        return convertToDTO(carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException(id)));
    }

    @Transactional
    public CarDTO createCar(CarDTO carDTO) {
        if (carRepository.existsByVinIgnoreCase(carDTO.getVin())) {
            throw new DuplicateVinException(carDTO.getVin());
        }
        Car car = convertToEntity(carDTO);
        return convertToDTO(carRepository.save(car));
    }

    @Transactional
    public CarDTO updateCar(Long id, CarDTO carDTO) {
        if (carRepository.existsByVinIgnoreCaseAndIdNot(carDTO.getVin(), id)) {
            throw new DuplicateVinException(carDTO.getVin());
        }

        Car car = carRepository.findById(id)
                .orElseThrow(() -> new CarNotFoundException(id));

        updateCarFromDTO(car, carDTO);
        return convertToDTO(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id) {
        if (!carRepository.existsById(id)) {
            throw new CarNotFoundException(id);
        }
        carRepository.deleteById(id);
    }

    private CarDTO convertToDTO(Car car) {
        CarDTO dto = new CarDTO();
        dto.setId(car.getId());
        dto.setVin(car.getVin());
        dto.setBrand(car.getBrand());
        dto.setModel(car.getModel());
        dto.setYear(car.getYear());
        dto.setPrice(car.getPrice());
        dto.setType(car.getType());
        return dto;
    }

    private Car convertToEntity(CarDTO dto) {
        Car car = new Car();
        car.setId(dto.getId());
        car.setVin(dto.getVin().toUpperCase());
        car.setBrand(dto.getBrand());
        car.setModel(dto.getModel());
        car.setYear(dto.getYear());
        car.setPrice(dto.getPrice());
        car.setType(dto.getType());
        return car;
    }

    private void updateCarFromDTO(Car car, CarDTO dto) {
        car.setVin(dto.getVin().toUpperCase());
        car.setBrand(dto.getBrand());
        car.setModel(dto.getModel());
        car.setYear(dto.getYear());
        car.setPrice(dto.getPrice());
        car.setType(dto.getType());
    }
}
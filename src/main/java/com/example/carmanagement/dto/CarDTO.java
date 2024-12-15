package com.example.carmanagement.dto;

import jakarta.validation.constraints.*;

public class CarDTO {
    private Long id;

    @NotBlank
    @Pattern(regexp = "[A-Z0-9]{17}", message = "VIN must be 17 characters long and contain only uppercase letters and numbers")
    private String vin;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @Min(1886)
    @Max(2100)
    private Integer year;

    @Positive
    private Double price;

    @NotBlank
    private String type;

    // Constructors
    public CarDTO() {}

    public CarDTO(Long id, String vin, String brand, String model, Integer year, Double price, String type) {
        this.id = id;
        this.vin = vin;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.price = price;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVin() {
        return vin;
    }

    public void setVin(String vin) {
        this.vin = vin;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
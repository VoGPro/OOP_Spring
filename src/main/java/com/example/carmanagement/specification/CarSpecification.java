package com.example.carmanagement.specification;

import com.example.carmanagement.entity.Car;
import org.springframework.data.jpa.domain.Specification;

public class CarSpecification {
    public static Specification<Car> vinContains(String vin) {
        return (root, query, builder) ->
                builder.like(builder.lower(root.get("vin")),
                        "%" + vin.toLowerCase() + "%");
    }

    public static Specification<Car> brandEquals(String brand) {
        return (root, query, builder) ->
                builder.equal(builder.lower(root.get("brand")),
                        brand.toLowerCase());
    }

    public static Specification<Car> modelEquals(String model) {
        return (root, query, builder) ->
                builder.equal(builder.lower(root.get("model")),
                        model.toLowerCase());
    }
}
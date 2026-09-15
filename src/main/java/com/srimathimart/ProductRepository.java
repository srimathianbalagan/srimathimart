package com.srimathimart;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.srimathimart.loginbackend.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Category பெயர் மூலம் பொருள்களைத் தேட இந்த வரி பயன்படும்:
    List<Product> findByCategoryIgnoreCase(String category);

}

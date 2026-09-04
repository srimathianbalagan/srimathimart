package com.srimathimart;

import org.springframework.web.bind.annotation.*;

import com.srimathimart.loginbackend.Product;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository = null;

    // 1. எல்லா பொருட்களையும் பட்டியலிட (Get All Products)
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. புதிய பொருளைச் சேர்க்க (Add New Product)
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }
}


package com.srimathimart;

import org.springframework.web.bind.annotation.*;

import com.srimathimart.loginbackend.Product;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;

    ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 1. அனைத்து பொருள்களையும் பெற
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. குறிப்பிட்ட Category பொருள்களை மட்டும் பெற (எ.கா: /api/products/category/Men)
    @GetMapping("/category/{categoryName}")
    public List<Product> getProductsByCategory(@PathVariable String categoryName) {
        if (categoryName.equalsIgnoreCase("All")) {
            return productRepository.findAll();
        }
        return productRepository.findByCategoryIgnoreCase(categoryName);
    }
}

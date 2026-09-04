package com.srimathimart.loginbackend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.srimathimart.ProductRepository;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.srimathimart")
@EntityScan(basePackages = "com.srimathimart")
public class LoginbackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoginbackendApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Product p1 = new Product();
                p1.setName("Men Denim Shirt");
                p1.setDescription("Casual Cotton Shirt");
                p1.setPrice(999.00);
                p1.setStockQty(15);
                p1.setCategory("Men");
                p1.setImageUrl("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150");
                repository.save(p1);

                Product p2 = new Product();
                p2.setName("Floral Summer Dress");
                p2.setDescription("Womens Casual Dress");
                p2.setPrice(1299.00);
                p2.setStockQty(20);
                p2.setCategory("Dresses");
                p2.setImageUrl("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=150");
                repository.save(p2);

                Product p3 = new Product();
                p3.setName("Casual White Top");
                p3.setDescription("Comfortable Wear Top");
                p3.setPrice(699.00);
                p3.setStockQty(25);
                p3.setCategory("Tops");
                p3.setImageUrl("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=150");
                repository.save(p3);
            }
        };
    }
}

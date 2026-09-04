package com.srimathimart;

import org.springframework.web.bind.annotation.*;

import com.srimathimart.loginbackend.Product;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartRepository cartRepository = null;

    private final ProductRepository productRepository = null;

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        Product product = productRepository.findById(productId).orElseThrow();
        CartItem cartItem = new CartItem(userId, product, quantity);
        return cartRepository.save(cartItem);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public void removeFromCart(@PathVariable Long cartItemId) {
        cartRepository.deleteById(cartItemId);
    }
}

package com.srimathimart;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;

    private final CartRepository cartRepository;

    public OrderController(OrderRepository orderRepository, CartRepository cartRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
    }

    // Cart-ல் உள்ள பொருட்களை Order ஆக மாற்றி Mock Payment நிறைவு செய்ய
    @PostMapping("/checkout/{userId}")
    public Order placeOrder(@PathVariable Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        if (items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = items.stream()
                .mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity())
                .sum();

        Order order = new Order(userId, total, "CONFIRMED");
        Order savedOrder = orderRepository.save(order);

        // Checkout முடிந்ததும் Cart-ஐ காலியாக்க
        cartRepository.deleteAll(items);

        return savedOrder;
    }
}


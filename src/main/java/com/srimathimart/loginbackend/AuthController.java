package com.srimathimart.loginbackend;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Frontend (HTML/JS) உடன் இணையும்படி வசதி செய்கிறது
public class AuthController {

    private final UserRepository userRepository;

    AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public String login(@RequestBody User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail());
        if (user != null && user.getPassword().equals(loginUser.getPassword())) {
            return "Login Successful!";
        }
        return "Invalid Credentials!";
    }

    @PostMapping("/register")
    public String register(@RequestBody User newUser) {
        userRepository.save(newUser);
        return "User Registered Successfully!";
    }
}
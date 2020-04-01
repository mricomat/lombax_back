package com.lombax.controller;

import com.lombax.data.UserModel;
import com.lombax.repository.UserRepository;
import com.lombax.service.EmailService;
import com.lombax.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;


@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @RequestMapping(method = RequestMethod.POST, value = "/register", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> registerUser(@RequestBody UserModel userModel) {
        UserModel user = userService.save(userModel);
        final UriComponents uriComponents = ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/users/{id}").buildAndExpand(user.getId());
        return ResponseEntity.created(uriComponents.toUri()).body(user);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/update", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> updateUser(@RequestBody UserModel userModel) {
        UserModel result = userService.update(userModel);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/isEmailValid", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> isEmailValid(@RequestBody String email) {
        boolean result = userService.isEmailValid(email);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/isUserValid", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> isUsernameValid(@RequestBody String username) {
        boolean result = userService.isUsernameValid(username);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/delete", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> deleteUser(@RequestBody String id) {
        boolean result = userService.delete(id);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/forgot", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> forgotPassword(@RequestBody String email) {
        emailService.sendEmail(email);
        return ResponseEntity.ok("We have sent your password to you email");
    }

}

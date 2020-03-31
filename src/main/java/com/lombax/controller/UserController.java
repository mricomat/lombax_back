package com.lombax.controller;

import com.lombax.data.UserModel;
import com.lombax.repository.UserRepository;
import com.lombax.service.UserService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.web.util.UriComponents;
import org.slf4j.Logger;

import java.util.Optional;


@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository repository;

    @Autowired
    private UserService userService;

    @RequestMapping(method = RequestMethod.POST, value = "/register", produces = {MediaType.APPLICATION_JSON_VALUE})
    ResponseEntity<?> registerUser(@RequestBody UserModel userModel) {
        UserModel user = userService.save(userModel);
        final UriComponents uriComponents = ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/users/{id}").buildAndExpand(user.getId());
        return ResponseEntity.created(uriComponents.toUri()).build();
    }
}

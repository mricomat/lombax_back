package com.lombax.security;

import com.lombax.data.UserModel;
import com.lombax.exception.EntityAlreadyExistsException;
import com.lombax.service.user.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserService userService;

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        // Let people login with either username or email
        UserModel user = userService.findByUsername(username);

        if(user == null) {
            throw new EntityAlreadyExistsException(UserModel.class, "username", user.getUsername());
        }

        return UserPrincipal.create(user);
    }

    @Transactional
    public UserDetails loadUserById(String id) {
        UserModel user = userService.findById(id);
        if(user == null) {
            throw new EntityAlreadyExistsException(UserModel.class, "username", user.getUsername());
        }

        return UserPrincipal.create(user);
    }
}
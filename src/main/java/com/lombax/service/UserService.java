package com.lombax.service;

import com.lombax.data.UserModel;

import java.util.Optional;

public interface UserService {

    UserModel save(UserModel user);

    UserModel update(UserModel user);

    boolean delete(String id);

    boolean isEmailValid(String email);

    boolean isUsernameValid(String username);

    Optional<UserModel> findByUsername(String username);

    Optional<UserModel> findByEmail(String email);

}

package com.lombax.service;

import com.lombax.data.UserModel;

import java.util.Optional;

public interface UserService {

    UserModel save(UserModel user);

    Optional<UserModel> update(UserModel user);

    boolean delete(String id);

    Optional<UserModel> findByUsername(String username);

    Optional<UserModel> findByEmail(String email);

}

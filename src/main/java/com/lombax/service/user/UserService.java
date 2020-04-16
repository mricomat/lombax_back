package com.lombax.service.user;

import com.lombax.data.UserModel;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface UserService {

    UserModel save(UserModel user);

    UserModel update(String userId, String key, Object value);

    boolean delete(String id);

    boolean isEmailValid(String email);

    boolean isUsernameValid(String username);

    UserModel findByUsername(String username);

    Optional<UserModel> findByEmail(String email);

    UserModel findById(String userId);

}

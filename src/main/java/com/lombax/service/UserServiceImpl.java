package com.lombax.service;

import com.lombax.data.UserModel;
import com.lombax.exception.EntityAlreadyExistsException;
import com.lombax.exception.EntityNotFoundException;
import com.lombax.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;


import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public UserServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public UserModel save(UserModel user) {
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(user.getUserName()));
        if (mongoTemplate.exists(query, UserModel.class)) {
            throw new EntityAlreadyExistsException(UserModel.class, "username", user.getUserName());
        }

        query = new Query();
        query.addCriteria(Criteria.where("email").is(user.getEmail()));
        if (mongoTemplate.exists(query, UserModel.class)) {
            throw new EntityAlreadyExistsException(UserModel.class, "email", user.getEmail());
        }

        user.setId(UUID.randomUUID());
        return mongoTemplate.save(user);
    }

    @Override
    public Optional<UserModel> update(UserModel user) {
        return null;
    }

    @Override
    public boolean delete(String id) {
        return false;
    }

    @Override
    public Optional<UserModel> findByUsername(String username) {


        return null;
    }

    @Override
    public Optional<UserModel> findByEmail(String email) {
        return null;
    }

}

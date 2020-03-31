package com.lombax.service;

import com.lombax.data.UserModel;
import com.lombax.exception.EntityAlreadyExistsException;
import com.lombax.exception.EntityNotFoundException;
import com.lombax.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;


import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
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

        user.setId(UUID.randomUUID().toString());
        logger.info("User REGISTERED: " + user.getUserName());
        return mongoTemplate.save(user);
    }

    // The returned user object has the same values as the initial state in the database.
    @Override
    public UserModel update(UserModel user) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(user.getId()));

        UserModel result = null;
        try {
            result = mongoTemplate.findAndModify(query, generateUpdate(user), UserModel.class);
        } catch (InvocationTargetException | IllegalAccessException | IntrospectionException e) {
            e.printStackTrace();
        }

        if (result == null) {
            throw new EntityNotFoundException(UserModel.class, "id", user.getId());
        }

        logger.info("User UPDATE: " + result.getUserName());

        return result;
    }

    Update generateUpdate(UserModel user) throws InvocationTargetException, IllegalAccessException, IntrospectionException {
        Update update = new Update();

        BeanInfo beanInfo = Introspector.getBeanInfo(UserModel.class);
        for (PropertyDescriptor propertyDesc : beanInfo.getPropertyDescriptors()) {
            String propertyName = propertyDesc.getName();
            Object value = propertyDesc.getReadMethod().invoke(user);
            if (!propertyName.equals("class")) {
                update.set(propertyName, value);
            }
        }
        return update;
    }

    @Override
    public boolean delete(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(id));
        mongoTemplate.remove(query, UserModel.class);
        return true;
    }

    @Override
    public boolean isEmailValid(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("email").is(email));
        return mongoTemplate.exists(query, UserModel.class);
    }

    @Override
    public boolean isUsernameValid(String username) {
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(username));
        return mongoTemplate.exists(query, UserModel.class);
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

package com.lombax.service.user;

import com.lombax.data.UserModel;
import com.lombax.exception.EntityAlreadyExistsException;
import com.lombax.exception.EntityNotFoundException;
import com.lombax.service.avatar.AvatarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final MongoTemplate mongoTemplate;

    @Autowired
    public UserServiceImpl(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Autowired
    PasswordEncoder mPasswordEncoder;

    @Autowired
    AvatarService avatarService;

    @Override
    public UserModel save(UserModel user) {
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(user.getUsername()));
        if (mongoTemplate.exists(query, UserModel.class)) {
            throw new EntityAlreadyExistsException(UserModel.class, "username", user.getUsername());
        }

        query = new Query();
        query.addCriteria(Criteria.where("email").is(user.getEmail()));
        if (mongoTemplate.exists(query, UserModel.class)) {
            throw new EntityAlreadyExistsException(UserModel.class, "email", user.getEmail());
        }

        user.setId(UUID.randomUUID().toString());
        user.setPassword(mPasswordEncoder.encode(user.getPassword()));

        logger.info("User REGISTERED: " + user.getUsername());
        return mongoTemplate.save(user);
    }

    // The returned user object has the same values as the initial state in the database.
    // TODO Check if is updating the password and chang it to md5
    @Override
    public UserModel update(String userId, String key, Object value) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(userId));
        Update update = new Update();
        update.set(key, value);

        UserModel result = mongoTemplate.findAndModify(query, update, UserModel.class);

        if (result == null) {
            throw new EntityNotFoundException(UserModel.class, "id", userId);
        }

        logger.info("User UPDATE: " + result.getUsername());

        return result;
    }

//    Update generateUpdate(UserModel user) throws InvocationTargetException, IllegalAccessException, IntrospectionException {
//        Update update = new Update();
//
//        BeanInfo beanInfo = Introspector.getBeanInfo(UserModel.class);
//        for (PropertyDescriptor propertyDesc : beanInfo.getPropertyDescriptors()) {
//            String propertyName = propertyDesc.getName();
//            Object value = propertyDesc.getReadMethod().invoke(user);
//            if (!propertyName.equals("class")) {
//                update.set(propertyName, value);
//            }
//        }
//        return update;
//    }

    // TODO Check if user exists first?
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
        return !mongoTemplate.exists(query, UserModel.class);
    }

    @Override
    public boolean isUsernameValid(String username) {
        Query query = new Query();
        query.addCriteria(Criteria.where("username").is(username));
        return !mongoTemplate.exists(query, UserModel.class);
    }

    @Override
    public UserModel findByUsername(String username) {
        UserModel result = mongoTemplate.findOne(new Query(Criteria.where("username").is(username)), UserModel.class);
        if (result == null) {
            throw new EntityNotFoundException(UserModel.class, "user", username);
        }
        return result;
    }

    @Override
    public Optional<UserModel> findByEmail(String email) {
        return null;
    }

    @Override
    public UserModel findById(String userId) {
        UserModel result = mongoTemplate.findOne(new Query(Criteria.where("id").is(userId)), UserModel.class);
        if (result == null) {
            throw new EntityNotFoundException(UserModel.class, "user", userId);
        }
        return result;
    }

}

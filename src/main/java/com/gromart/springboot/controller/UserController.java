package com.gromart.springboot.controller;

import com.gromart.springboot.model.User;
import com.gromart.springboot.repository.UserRepository;
import com.gromart.springboot.service.UserService;
import com.gromart.springboot.util.CustomErrorType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/gromart/")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    //------------------------Get Buyer with paging---------------------------------
    @RequestMapping(value = "/user/paging/", method = RequestMethod.GET)
    public ResponseEntity<?> getProductWithPaging(@RequestParam int page, @RequestParam int limit) {
        Map<String, Object> users = userService.findAllWithPaging(page, limit);
        if (users.isEmpty()) {
            return new ResponseEntity<>(users, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(users, HttpStatus.OK);
        }
    }

    //-----------------------------find user (buyer) with id-------------------------------------------
    @RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
    public ResponseEntity<?> findUserById(@PathVariable("userId") String userId) {
        User user = userService.findById(userId);
        if (user == null) {
            return new ResponseEntity<>(new CustomErrorType("User with id " + userId + " not found"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    //--------------------------------daftar user baru-----------------------------------------------
    @RequestMapping(value = "/user/", method = RequestMethod.POST)
    public ResponseEntity<?> createProduct(@Valid @RequestBody User user, Errors error) {
        if (error.hasErrors()) {
            return new ResponseEntity<>(error.getFieldError().getDefaultMessage(), HttpStatus.BAD_REQUEST);
        }
        if (userService.findByUserName(user.getUserName()) != null) {
            return new ResponseEntity<>(new CustomErrorType("Unable to create. UserName " +
                    user.getUserName() + " already exist."), HttpStatus.CONFLICT);
        } else if (userService.findByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>(new CustomErrorType("Unable to create. Email " +
                    user.getEmail() + " already exist."), HttpStatus.CONFLICT);
        } else if (userService.findByPhoneNumber(user.getPhoneNumber()) != null) {
            return new ResponseEntity<>(new CustomErrorType("Unable to create. phone Number " +
                    user.getPhoneNumber() + " already exist."), HttpStatus.CONFLICT);
        } else {
            userService.saveUser(user);
            return new ResponseEntity<>(user, HttpStatus.CREATED);
        }
    }

    //---------------------fungsi login----------------------
    @GetMapping("user/login/")
    public ResponseEntity<?> login(@RequestParam String userName, @RequestParam String password) {
        User user = userService.loginAccount(userName, password);
        if (user == null) {
            return new ResponseEntity<>(new CustomErrorType("Username or password is wrong!"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    ////---------------------------update limit (invoice dan credit)-------------------------------------------
    @RequestMapping(value = "/user/limit/{userId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateLimit(@PathVariable("userId") String userId, @Valid @RequestBody User user) {
        User currentUser = userService.findById(userId);
        if (currentUser == null) {
            return new ResponseEntity<>(new CustomErrorType("Unable to update User with id " + userId + " not found."),
                    HttpStatus.NOT_FOUND);
        } else {
            currentUser.setCreditLimit(user.getCreditLimit());
            currentUser.setInvoiceLimit(user.getInvoiceLimit());
            currentUser.setUpdatedBy(user.getUpdatedBy());
            currentUser.setUpdatedDate(user.getUpdatedDate());
            userService.updateLimit(currentUser);
            return new ResponseEntity<>(currentUser, HttpStatus.OK);
        }
    }

    //-------------------Ubah Password------------------------
    @RequestMapping(value = "/user/password/{userId}/", method = RequestMethod.PUT)
    public ResponseEntity<?> updatePassword(
            @PathVariable("userId") String userId,
            @RequestParam String oldPass,
            @RequestParam String newPass,
            @RequestParam String newPass2) {

        User currentUser = userRepository.findByIdForPassword(userId);
        if (!currentUser.getPassword().equals(oldPass)) {
            return new ResponseEntity<>(new CustomErrorType("Unable to update, Wrong Old Password"),
                    HttpStatus.CONFLICT);
        } else if (!newPass.equals(newPass2)) {
            return new ResponseEntity<>(new CustomErrorType("Unable to update. New Password Not Equals"),
                    HttpStatus.CONFLICT);
        } else {
            currentUser.setPassword(newPass);
            userService.updatePassword(currentUser);
            return new ResponseEntity<>(currentUser, HttpStatus.OK);
        }
    }

    //--------------------------------ubah profile--------------------
    @RequestMapping(value = "/user/profile/{userId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateProfile(@PathVariable("userId") String userId, @Valid @RequestBody User user) {
        User currentUser = userService.findById(userId);
        if (currentUser == null) {
            return new ResponseEntity<>(new CustomErrorType("Unable to update User with id " + userId + " not found."),
                    HttpStatus.NOT_FOUND);
        } else {
            currentUser.setFirstName(user.getFirstName());
            currentUser.setLastName(user.getLastName());
            currentUser.setPhoneNumber(user.getPhoneNumber());
            currentUser.setEmail(user.getEmail());
            userService.updateProfile(currentUser);
            return new ResponseEntity<>(currentUser, HttpStatus.OK);
        }
    }

    //------------------------get name with paging ---------------------------------
    @RequestMapping(value = "/user/findname/{firstName}/", method = RequestMethod.GET)
    public ResponseEntity<?> getNameWithPaging(@PathVariable("firstName") String firstName, @RequestParam int page, @RequestParam int limit) {
        Map<String, Object> map = userService.findNameWithPaging(firstName, page, limit);
        if (map.isEmpty()) {
            return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
    }

    //------------------------get Id with paging ---------------------------------
    @RequestMapping(value = "/user/findid/{userId}/", method = RequestMethod.GET)
    public ResponseEntity<?> getIdWithPaging(@PathVariable("userId") String userId, @RequestParam int page, @RequestParam int limit) {
        Map<String, Object> map = userService.findIdWithPaging(userId, page, limit);
        if (map.isEmpty()) {
            return new ResponseEntity<>(map, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(map, HttpStatus.OK);
        }
    }


    //    //----------------------------------Search userid-------------------------------------
//    @RequestMapping(value = "/user/id/{userId}", method = RequestMethod.GET)
//    public ResponseEntity<?> getUserById(@PathVariable("userId") String userId) {
//        List<User> user = userService.searchId(userId);
//        if (user == null) {
//            return new ResponseEntity<>(new CustomErrorType("User with id " + userId + " not found"), HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }
//
//    //------------------------search userName---------------------
//    @RequestMapping(value = "/user/name/{userName}", method = RequestMethod.GET)
//    public ResponseEntity<?> getUserByName(@PathVariable("userName") String userName) {
//        List<User> user = userService.searchName(userName);
//        if (user == null) {
//            return new ResponseEntity<>(new CustomErrorType("User with id " + userName + " not found"), HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<>(user, HttpStatus.OK);
//    }

    //-------------------find user buyer only----------------------------
//    @RequestMapping(value = "/user/buyer/", method = RequestMethod.GET)
//    public ResponseEntity<List<User>> listAllBuyers() {
//        List<User> users = userService.findAllBuyer();
//        if (users.isEmpty()) {
//            return new ResponseEntity<>(users, HttpStatus.NOT_FOUND);
//        }
//        return new ResponseEntity<>(users, HttpStatus.OK);
//    }

    //    @RequestMapping(value = "/user/count/", method = RequestMethod.GET)
//    public ResponseEntity<?> countUser() {
//        int itemCount = userService.findAllCount();
//        return new ResponseEntity<>(itemCount, HttpStatus.OK);
//    }

}
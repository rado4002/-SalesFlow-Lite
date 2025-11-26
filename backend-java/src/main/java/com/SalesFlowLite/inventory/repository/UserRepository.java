package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Login using phone number
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByPhoneNumber(String phoneNumber);

    // Username optional but useful for JWT
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}

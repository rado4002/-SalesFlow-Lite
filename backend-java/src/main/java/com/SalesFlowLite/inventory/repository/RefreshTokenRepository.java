package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.RefreshToken;
import com.SalesFlowLite.inventory.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findAllByUserAndRevokedFalse(User user);

    void deleteAllByUser(User user);
}

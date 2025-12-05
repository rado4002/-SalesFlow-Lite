// src/main/java/com/SalesFlowLite/inventory/model/entity/User.java
package com.SalesFlowLite.inventory.model.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // <-- AUTO-INCREMENT BIGINT
    private Long id;                                      // <-- Long, not String/UUID

    @Column(name = "phone_number", nullable = false, unique = true, length = 20)
    private String phoneNumber;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = true, length = 100)
    private String username;

    @Column(nullable = true, length = 150)
    private String email;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = true)
    private LocalDateTime updatedAt;

    // -------------------------------------------------------------------------
    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", role=" + role +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
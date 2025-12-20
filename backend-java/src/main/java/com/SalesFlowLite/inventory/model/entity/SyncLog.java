// SyncLog.java
package com.SalesFlowLite.inventory.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "sync_logs")
@Data
public class SyncLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long syncTimestamp;
    private String status;
}
package com.SalesFlowLite.inventory.repository;

import com.SalesFlowLite.inventory.model.entity.SyncLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SyncLogRepository extends JpaRepository<SyncLog, Long> {}
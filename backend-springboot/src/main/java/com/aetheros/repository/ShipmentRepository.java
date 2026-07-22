package com.aetheros.repository;

import com.aetheros.model.ShipmentEntity; // Boilerplate entity mapping
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipmentRepository extends JpaRepository<ShipmentEntity, Long> {

    @Query("SELECT s FROM ShipmentEntity s WHERE " +
           "(:status IS NULL OR s.status = :status) AND " +
           "(:origin IS NULL OR s.originPort = :origin)")
    Page<ShipmentEntity> findFiltered(String status, String origin, Pageable pageable);
}

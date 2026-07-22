package com.aetheros.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "shipments", indexes = {
    @Index(name = "idx_shipments_status", columnList = "status"),
    @Index(name = "idx_shipments_origin", columnList = "originPort")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String carrierId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String originPort;

    @Column(nullable = false)
    private String destinationPort;

    @Column(nullable = false)
    private String status;

    private Double riskFactor;
    private Double carbonTonnes;

    @Column(nullable = false)
    private LocalDateTime departureDate;

    private LocalDateTime arrivalDate;
}

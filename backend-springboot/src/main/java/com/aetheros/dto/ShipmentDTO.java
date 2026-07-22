package com.aetheros.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShipmentDTO {
    private Long id;

    @NotBlank(message = "Carrier ID cannot be blank")
    private String carrierId;

    @NotBlank(message = "Carrier name cannot be blank")
    private String name;

    @NotBlank(message = "Origin port cannot be blank")
    private String originPort;

    @NotBlank(message = "Destination port cannot be blank")
    private String destinationPort;

    private String status;
    private Double riskFactor;
    private Double carbonTonnes;

    @NotNull(message = "Departure date is required")
    private LocalDateTime departureDate;

    private LocalDateTime arrivalDate;
}

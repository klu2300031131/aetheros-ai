package com.aetheros.controller;

import com.aetheros.dto.ShipmentDTO;
import com.aetheros.service.ShipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping
    public ResponseEntity<Page<ShipmentDTO>> getShipments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String origin,
            @PageableDefault(size = 20, sort = "departureDate") Pageable pageable) {
        Page<ShipmentDTO> shipments = shipmentService.findShipments(status, origin, pageable);
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentDTO> getShipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
    }

    @PostMapping
    public ResponseEntity<ShipmentDTO> createShipment(@Valid @RequestBody ShipmentDTO dto) {
        ShipmentDTO created = shipmentService.saveShipment(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/reroute")
    public ResponseEntity<ShipmentDTO> rerouteShipment(
            @PathVariable Long id,
            @RequestParam String destinationPort) {
        ShipmentDTO updated = shipmentService.rerouteShipment(id, destinationPort);
        return ResponseEntity.ok(updated);
    }
}

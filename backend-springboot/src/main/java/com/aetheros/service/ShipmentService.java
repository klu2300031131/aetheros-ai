package com.aetheros.service;

import com.aetheros.dto.ShipmentDTO;
import com.aetheros.model.ShipmentEntity;
import com.aetheros.repository.ShipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    @Transactional(readOnly = true)
    public Page<ShipmentDTO> findShipments(String status, String origin, Pageable pageable) {
        return shipmentRepository.findFiltered(status, origin, pageable)
                .map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public ShipmentDTO getShipmentById(Long id) {
        ShipmentEntity entity = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment with ID " + id + " not found"));
        return toDTO(entity);
    }

    @Transactional
    public ShipmentDTO saveShipment(ShipmentDTO dto) {
        ShipmentEntity entity = toEntity(dto);
        if (entity.getStatus() == null) {
            entity.setStatus("PENDING");
        }
        ShipmentEntity saved = shipmentRepository.save(entity);
        return toDTO(saved);
    }

    @Transactional
    public ShipmentDTO rerouteShipment(Long id, String destinationPort) {
        ShipmentEntity entity = shipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shipment with ID " + id + " not found"));
        entity.setDestinationPort(destinationPort);
        entity.setStatus("REROUTED");
        ShipmentEntity saved = shipmentRepository.save(entity);
        return toDTO(saved);
    }

    private ShipmentDTO toDTO(ShipmentEntity entity) {
        return ShipmentDTO.builder()
                .id(entity.getId())
                .carrierId(entity.getCarrierId())
                .name(entity.getName())
                .originPort(entity.getOriginPort())
                .destinationPort(entity.getDestinationPort())
                .status(entity.getStatus())
                .riskFactor(entity.getRiskFactor())
                .carbonTonnes(entity.getCarbonTonnes())
                .departureDate(entity.getDepartureDate())
                .arrivalDate(entity.getArrivalDate())
                .build();
    }

    private ShipmentEntity toEntity(ShipmentDTO dto) {
        return ShipmentEntity.builder()
                .id(dto.getId())
                .carrierId(dto.getCarrierId())
                .name(dto.getName())
                .originPort(dto.getOriginPort())
                .destinationPort(dto.getDestinationPort())
                .status(dto.getStatus())
                .riskFactor(dto.getRiskFactor())
                .carbonTonnes(dto.getCarbonTonnes())
                .departureDate(dto.getDepartureDate())
                .arrivalDate(dto.getArrivalDate())
                .build();
    }
}

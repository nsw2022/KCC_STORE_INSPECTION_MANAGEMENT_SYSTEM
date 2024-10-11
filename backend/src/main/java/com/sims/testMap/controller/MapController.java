package com.sims.testMap.controller;

import com.sims.testMap.service.MapTestService;
import com.sims.testMap.vo.Coordinates;
import com.sims.testMap.vo.DrivingRequest;
import com.sims.testMap.vo.RouteRequest;
import com.sims.testMap.vo.RouteResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
public class MapController {

    @Value("${naver.maps.client.id}")
    private String naverClientId;

    @Autowired
    private MapTestService mapService;


    @GetMapping("/test")
    public String test(Model model) {
        model.addAttribute("naverClientId", naverClientId);
        return "test";
    }

    // 테스트 엔드포인트: 고정된 좌표로 최단 경로 계산
    @GetMapping("/Map/TestDrivingRoute")
    public ResponseEntity<?> testDrivingRoute(){
        RouteResponse routeResponse = mapService.testDrivingRoute();
        if(routeResponse != null){
            return ResponseEntity.ok(routeResponse);
        } else {
            return ResponseEntity.status(500).body("경로 검색에 실패했습니다.");
        }
    }

    // 주소를 좌표로 변환하는 엔드포인트
    @PostMapping("/Map/GetCoordinates")
    public ResponseEntity<?> getCoordinates(@RequestBody DrivingRequest request){
        log.info("@@@@@@@@@@@@@@@@@");
        log.info("오긴함?");
        String address = request.getAddress();

        if(address == null || address.trim().isEmpty()){
            log.warn("Received empty address.");
            Map<String, Object> response = new HashMap<>();
            response.put("status", 400);
            response.put("message", "주소가 비어 있습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        Coordinates coords = mapService.geocodeAddress(address.trim());
        if(coords != null){
            log.info(coords.toString());
            Map<String, Object> response = new HashMap<>();
            response.put("status", 200);
            response.put("data", coords);
            return ResponseEntity.ok(response);
        } else {
            log.warn("Failed to get coordinates for address: {}", address);
            Map<String, Object> response = new HashMap<>();
            response.put("status", 400);
            response.put("message", "주소를 찾을 수 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 최단 경로를 계산하는 엔드포인트
    @PostMapping("/Map/SearchRoute")
    public ResponseEntity<?> searchRoute(@RequestBody RouteRequest routeRequest){
        // 시작 좌표
        Coordinates start = routeRequest.getStart();
        if(start == null){
            return ResponseEntity.badRequest().body("시작 좌표가 비어있습니다.");
        }
        double startX = start.getX();
        double startY = start.getY();
        Coordinates startCoord = new Coordinates(startX, startY);

        // 목적지 주소 목록을 쉼표로 분리
        String addressListStr = routeRequest.getAddressList();
        if(addressListStr == null || addressListStr.trim().isEmpty()){
            return ResponseEntity.badRequest().body("addressList가 비어있습니다.");
        }

        String[] addressArray = addressListStr.split(",");
        List<Coordinates> viaPoints = new ArrayList<>();

        for(String address : addressArray){
            if(address.trim().isEmpty()){
                continue; // 빈 주소는 건너뜁니다.
            }
            Coordinates coords = mapService.geocodeAddress(address.trim());
            if(coords != null){
                viaPoints.add(coords);
            } else {
                // 주소 검색에 실패한 경우 처리
                return ResponseEntity.badRequest().body("주소 검색에 실패했습니다: " + address);
            }
        }

        if(viaPoints.isEmpty()){
            return ResponseEntity.badRequest().body("유효한 목적지 주소가 없습니다.");
        }

        // 목적지 설정 (예시로 마지막 경유지를 목적지로 설정)
        Coordinates end = viaPoints.get(viaPoints.size() - 1);
        // 경유지는 마지막 주소를 제외한 나머지
        List<Coordinates> actualViaPoints = viaPoints.subList(0, viaPoints.size() - 1);

        // 최단 경로 계산
        RouteResponse routeResponse = mapService.getDrivingRoute(startCoord, end, actualViaPoints);

        if(routeResponse != null && (routeResponse.getCode() == 0 || routeResponse.getRoute() != null)){
            return ResponseEntity.ok(routeResponse);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("code", routeResponse != null ? routeResponse.getCode() : 500);
            response.put("message", "경로 검색에 실패했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

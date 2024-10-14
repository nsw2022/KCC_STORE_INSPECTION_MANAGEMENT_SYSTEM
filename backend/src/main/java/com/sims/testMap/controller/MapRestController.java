package com.sims.testMap.controller;

import com.sims.testMap.service.MapTestService;
import com.sims.testMap.vo.Coordinates;
import com.sims.testMap.vo.RouteResponse;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController // @Controller에서 @RestController로 변경
@RequestMapping("/api/map") // 공통 경로 설정
@Slf4j
public class MapRestController {



    @Autowired
    private MapTestService mapService2;

    /**
     * **테스트 엔드포인트**
     * 고정된 좌표로 최적화된 경로를 계산하고 응답을 반환합니다.
     *
     * @return 최적화된 경로 정보 또는 오류 메시지
     */
    @GetMapping("/test-driving-route")
    public ResponseEntity<?> testDrivingRoute() {
        try {
            RouteResponse response = mapService2.testDrivingRoute();

            if (response != null) {
                if (response.getCode() == 0) {
                    // 성공적인 응답
                    return ResponseEntity.ok(response);
                } else {
                    // API 응답 코드가 실패를 나타낼 경우
                    return ResponseEntity.badRequest().body(response.getMessage());
                }
            } else {
                // 응답이 null인 경우
                return ResponseEntity.status(500).body("서버 내부 오류: 응답이 null입니다.");
            }
        } catch (Exception e) {
            log.error("테스트 경로 호출 중 예외 발생: ", e);
            return ResponseEntity.status(500).body("서버 내부 오류: 예외 발생");
        }
    }

    /**
     * **실제 경로 요청 엔드포인트**
     * 클라이언트로부터 시작점, 목적지, 경유지를 받아 최적화된 경로를 계산하고 반환합니다.
     *
     * @param startLat  시작점 위도
     * @param startLng  시작점 경도
     * @param goalsLat  목적지 위도 리스트
     * @param goalsLng  목적지 경도 리스트
     * @param viaLat    경유지 위도 리스트
     * @param viaLng    경유지 경도 리스트
     * @return 최적화된 경로 정보 또는 오류 메시지
     */
    @PostMapping("/calculate-route")
    public ResponseEntity<?> calculateRoute(
            @RequestParam double startLat,
            @RequestParam double startLng,
            @RequestParam List<Double> goalsLat,
            @RequestParam List<Double> goalsLng,
            @RequestParam(required = false) List<Double> viaLat,
            @RequestParam(required = false) List<Double> viaLng
    ) {
        try {
            // 입력 검증
            if (goalsLat.size() != goalsLng.size()) {
                return ResponseEntity.badRequest().body("목적지의 위도와 경도의 개수가 일치하지 않습니다.");
            }

            if ((viaLat != null && viaLng == null) || (viaLat == null && viaLng != null)) {
                return ResponseEntity.badRequest().body("경유지의 위도와 경도의 개수가 일치하지 않습니다.");
            }

            // 시작점 좌표 생성
            Coordinates start = new Coordinates(startLng, startLat);

            // 목적지 좌표 리스트 생성
            List<Coordinates> goals = new ArrayList<>();
            for (int i = 0; i < goalsLat.size(); i++) {
                goals.add(new Coordinates(goalsLng.get(i), goalsLat.get(i)));
            }

            // 경유지 좌표 리스트 생성 (옵션)
            List<Coordinates> viaPoints = new ArrayList<>();
            if (viaLat != null && viaLng != null) {
                for (int i = 0; i < viaLat.size(); i++) {
                    viaPoints.add(new Coordinates(viaLng.get(i), viaLat.get(i)));
                }
            }

            // 최적화된 경로 계산
            RouteResponse response = mapService2.getOptimizedDrivingRoute(start, goals, viaPoints);

            if (response != null) {
                if (response.getCode() == 0) {
                    // 성공적인 응답
                    return ResponseEntity.ok(response);
                } else {
                    // API 응답 코드가 실패를 나타낼 경우
                    return ResponseEntity.badRequest().body(response.getMessage());
                }
            } else {
                // 응답이 null인 경우
                return ResponseEntity.status(500).body("서버 내부 오류: 응답이 null입니다.");
            }
        } catch (Exception e) {
            log.error("경로 계산 중 예외 발생: ", e);
            return ResponseEntity.status(500).body("서버 내부 오류: 예외 발생");
        }
    }

    /**
     * **역지오코딩 엔드포인트**
     * 좌표를 주소로 변환하여 반환합니다.
     *
     * @param payload 좌표 정보
     * @return 주소 정보 또는 오류 메시지
     */
    @PostMapping("/reverse-geocode")
    public ResponseEntity<?> reverseGeocode(@RequestBody Coordinates payload) {
        try {
            if (payload == null || payload.getX() == 0 || payload.getY() == 0) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(400, "유효하지 않은 좌표입니다.", null));
            }

            String address = mapService2.reverseGeocode(payload);
            if (address != null) {
                Map<String, String> response = new HashMap<>();
                response.put("address", address);
                return ResponseEntity.ok().body(new ApiResponse<>(200, "성공", response));
            } else {
                return ResponseEntity.status(500).body(new ApiResponse<>(500, "주소 변환에 실패했습니다.", null));
            }
        } catch (Exception e) {
            log.error("역지오코딩 중 예외 발생: ", e);
            return ResponseEntity.status(500).body(new ApiResponse<>(500, "서버 내부 오류: 예외 발생", null));
        }
    }


    /**
     * **추가 엔드포인트: GetCoordinates**
     * 주소를 좌표로 변환하여 반환합니다.
     *
     *
     * @return 좌표 정보 또는 오류 메시지
     */
    @PostMapping("/GetCoordinates")
    public ResponseEntity<?> getCoordinates(@RequestBody Map<String, String> payload) {
        try {
            String address = payload.get("address");
            if (address == null || address.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("주소가 제공되지 않았습니다.");
            }

            Coordinates coordinates = mapService2.geocodeAddress(address);
            if (coordinates != null) {
                Map<String, Double> response = new HashMap<>();
                response.put("x", coordinates.getX());
                response.put("y", coordinates.getY());
                return ResponseEntity.ok().body(new ApiResponse<>(200, "성공", response));
            } else {
                return ResponseEntity.status(500).body(new ApiResponse<>(500, "좌표 변환에 실패했습니다.", null));
            }
        } catch (Exception e) {
            log.error("좌표 변환 중 예외 발생: ", e);
            return ResponseEntity.status(500).body(new ApiResponse<>(500, "서버 내부 오류: 예외 발생", null));
        }
    }

    /**
     * **추가 엔드포인트: SearchRoute**
     * 경로를 검색하여 반환합니다.
     *
     * @param payload 경로 정보
     * @return 경로 정보 또는 오류 메시지
     */
    @PostMapping("/SearchRoute")
    public ResponseEntity<?> searchRoute(@RequestBody RouteRequest payload) {
        try {
            Coordinates start = payload.getStart();
            List<Coordinates> goals = payload.getAddressList();
            List<Coordinates> viaPoints = payload.getViaPoints();

            if (start == null || goals == null || goals.isEmpty()) {
                return ResponseEntity.badRequest().body("필수 경로 정보가 누락되었습니다.");
            }

            RouteResponse response = mapService2.getOptimizedDrivingRoute(start, goals, viaPoints);

            if (response != null) {
                if (response.getCode() == 0) {
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.badRequest().body(response.getMessage());
                }
            } else {
                return ResponseEntity.status(500).body("서버 내부 오류: 응답이 null입니다.");
            }
        } catch (Exception e) {
            log.error("경로 검색 중 예외 발생: ", e);
            return ResponseEntity.status(500).body("서버 내부 오류: 예외 발생");
        }
    }

    /**
     * **응답을 일관되게 처리하기 위한 ApiResponse 클래스**
     */
    @Data
    public static class ApiResponse<T> {
        private int status;
        private String message;
        private T data;

        public ApiResponse(int status, String message, T data) {
            this.status = status;
            this.message = message;
            this.data = data;
        }
    }

    /**
     * **경로 요청을 일관되게 처리하기 위한 RouteRequest 클래스**
     */
    @Data
    public static class RouteRequest {
        private Coordinates start;
        private List<Coordinates> addressList;
        private List<Coordinates> viaPoints;
    }
}

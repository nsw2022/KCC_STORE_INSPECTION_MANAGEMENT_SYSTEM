package com.sims.qsc.store_inspection.controller;

import com.sims.qsc.store_inspection.service.StoreInspectionService;
import com.sims.qsc.store_inspection.vo.StoreAllLocationResponse;
import com.sims.qsc.store_inspection.vo.StoreLocationResponse;
import com.sims.testMap.service.MapTestService;
import com.sims.testMap.vo.RouteRequest;
import com.sims.testMap.vo.RouteResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/qsc/store-inspection/map")
@RequiredArgsConstructor
@Slf4j
public class StoreMapRestController {

    private final StoreInspectionService storeInspectionService;
    private final MapTestService mapTestService;

    /**
     * @param mbrNo 로그인한 점검자의 고유번호(ID)
     * @return 로그인한 점검자의 매장목록
     */
    @GetMapping("/today-inspection/{mbrNo}")
    public List<StoreLocationResponse> selectMap(@PathVariable("mbrNo") String mbrNo) {
        return storeInspectionService.selectInspectionsByInspector(mbrNo);
    }

    /**
     * @param currentMbrNo 로그인한 가맹점
     * @return 모든 가맹점 -  SV, 담당자, 위치(위도, 경도)
     */
    @GetMapping("/all-store")
    public ResponseEntity<List<StoreAllLocationResponse>> selectAllInspectionMap(
            @RequestParam(value = "currentMbrNo", required = false) String currentMbrNo
    ) {
        List<StoreAllLocationResponse> stores = storeInspectionService.selectAllInspectionMap(currentMbrNo);
        return ResponseEntity.ok(stores);
    }

    /**
     * 동적 경로 요청 엔드포인트
     *
     * @param routeRequest 출발지와 목적지 정보를 담은 객체
     * @return 최적화된 경로 정보 또는 오류 메시지
     */
    @PostMapping("/select-driving-route")
    public ResponseEntity<?> selectDrivingRoute(@RequestBody RouteRequest routeRequest) {
        try {
            RouteResponse response = mapTestService.selectDrivingRoute(routeRequest);

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

}

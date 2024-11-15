package com.sims.qsc.store_inspection.controller;

import com.sims.qsc.store_inspection.service.StoreInspectionPopup.StoreInspectionPopupService;
import com.sims.qsc.store_inspection.service.StoreInspectionService;
import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filter")
@RequiredArgsConstructor
@Slf4j
public class StoreInspectionRestController {
    private final StoreInspectionService storeInspectionService;
    private final StoreInspectionPopupService storeInspectionPopupService;

    // 기존 엔드포인트: /filter/store_inspection
    @GetMapping("/store_inspection")
    public List<StoreInspectionResponse> selectAllInspectionSchedules() {
        return storeInspectionService.selectAllInspectionSchedules();
    }

    // /filter/store_inspection_popup
    @GetMapping("/store_inspection_popup")
    public List<StoreInspectionPopupResponse> selectInspectionDetails(
            @RequestParam("chklstId") Long chklstId,
            @RequestParam("storeNm") String storeNm,
            @RequestParam("inspPlanDt") String inspPlanDt
    ) {
        return storeInspectionPopupService.selectInspectionDetails(chklstId, storeNm, inspPlanDt);
    }

    @GetMapping("/recent_inspection_history")
    public List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(
            @RequestParam("storeNm") String storeNm,
            @RequestParam("inspSttsCd") String inspSttsCd
    ) {
        return storeInspectionPopupService.selectRecentInspectionHistory(storeNm, inspSttsCd);
    }


    /**
     * INSP_RESULT를 조회하거나, 존재하지 않으면 삽입 후 ID 반환
     *
     * @param request StoreInspectionPopupRequest 객체
     * @return INSP_RESULT_ID
     */
    @PostMapping("/get_or_insert_insp_result")
    public ResponseEntity<Long> getOrInsertInspResult(@RequestBody StoreInspectionPopupRequest request) {
        log.info("Controller: getOrInsertInspResult 호출 - 요청 데이터: {}", request);
        try {
            Long inspResultId = storeInspectionPopupService.getOrInsertInspResultId(request);
            log.info("Controller: getOrInsertInspResult 반환 값: {}", inspResultId);
            return ResponseEntity.ok(inspResultId);
        } catch (Exception e) {
            log.error("Controller: getOrInsertInspResult 실패 - 에러 메시지: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 점검 결과 임시저장 엔드포인트
     *
     * @param request StoreInspectionPopupRequest 객체
     * @return 성공 메시지
     */
    @PostMapping("/store_inspection_save")
    public ResponseEntity<String> storeInspectionSave(@RequestBody StoreInspectionPopupRequest request) {
        log.info("Controller: storeInspectionSave 호출 - 요청 데이터: {}", request);
        try {
            storeInspectionPopupService.insertInspectionResult(request);
//            storeInspectionPopupService.updateTotalValues(request); // 총점, 총과태료, 총영업정지일수 업데이트
            return ResponseEntity.ok("임시저장이 완료되었습니다.");
        } catch (Exception e) {
            log.error("Controller: storeInspectionSave 실패 - 에러 메시지: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("임시저장에 실패했습니다.");
        }
    }


    /**
     * 임시저장된 점검 결과 조회 엔드포인트
     *
     * @param inspResultId 점검 결과 ID
     * @return 임시저장된 점검 결과 데이터
     */
    @GetMapping("/get_temporary_inspection")
    public ResponseEntity<StoreInspectionPopupRequest> getTemporaryInspection(@RequestParam Long inspResultId) {
        log.info("Controller: getTemporaryInspection 호출 - inspResultId: {}", inspResultId);
        try {
            StoreInspectionPopupRequest temporaryData = storeInspectionPopupService.getTemporaryInspection(inspResultId);
            if (temporaryData != null && temporaryData.getInspections() != null && !temporaryData.getInspections().isEmpty()) {
                return ResponseEntity.ok(temporaryData);
            } else {
                log.info("임시저장된 데이터가 없습니다. HTTP 204 No Content 반환");
                return ResponseEntity.noContent().build();
            }
        } catch (Exception e) {
            log.error("Controller: getTemporaryInspection 실패 - 에러 메시지: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }


    /**
     * 총점수, 과태료 총합, 영업정지일수 업데이트
     *
     * @return 임시저장된 점검 결과 데이터
     */
    @PostMapping("/update_total_values")
    public ResponseEntity<String> updateTotalValues(@RequestBody StoreInspectionPopupRequest request) {
        log.info("Controller: updateTotalValues 호출 - 요청 데이터: {}", request);
        try {
            storeInspectionPopupService.updateTotalValues(request); // 총점, 총과태료, 총영업정지일수 업데이트
            return ResponseEntity.ok("총점, 총과태료, 총영업정지일수가 성공적으로 업데이트되었습니다.");
        } catch (Exception e) {
            log.error("Controller: updateTotalValues 실패 - 에러 메시지: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("총점, 총과태료, 총영업정지일수 업데이트에 실패했습니다.");
        }
    }


    /**
     * 점검 완료 정보 저장 엔드포인트
     *
     * @param completionRequest 점검 완료 정보 요청 데이터
     * @return 성공 메시지
     */
    @PostMapping("/complete_inspection")
    public ResponseEntity<String> completeInspection(@RequestBody CompletionRequest completionRequest) {
        log.info("Controller: completeInspection 호출 - 요청 데이터: {}", completionRequest);
        try {
            storeInspectionPopupService.completeInspection(
                    completionRequest.getInspResultId(),
                    completionRequest.getSignImgPath(),
                    completionRequest.getTotalReview()
            );
            return ResponseEntity.ok("점검 완료가 저장되었습니다.");
        } catch (Exception e) {
            log.error("Controller: completeInspection 실패 - 에러 메시지: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("점검 완료 저장에 실패했습니다.");
        }
    }

    // CompletionRequest 클래스 정의
    @Getter
    @Setter
    public static class CompletionRequest {
        private Long inspResultId;
        private String signImgPath;
        private String totalReview;
    }
}

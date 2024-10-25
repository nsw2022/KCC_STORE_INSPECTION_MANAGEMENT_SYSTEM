package com.sims.qsc.store_inspection.controller;

import com.sims.qsc.store_inspection.service.StoreInspectionPopup.StoreInspectionPopupService;
import com.sims.qsc.store_inspection.service.StoreInspectionService;
import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupResponse;
import lombok.RequiredArgsConstructor;
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
     * 점검 결과 임시저장
     *
     * @param request 점검 결과 요청 데이터
     * @return 응답 메시지
     */
    @PostMapping("/insert_insp_result")
    public ResponseEntity<Long> insertInspResult(@RequestBody StoreInspectionPopupRequest request) {
        Long inspResultId = storeInspectionPopupService.insertInspResult(request);
        return ResponseEntity.ok(inspResultId);
    }



    /**
     * INSP_RESULT를 조회하거나, 존재하지 않으면 삽입 후 ID 반환
     *
     * @param request StoreInspectionPopupRequest 객체
     * @return INSP_RESULT_ID
     */
    @PostMapping("/get_or_insert_insp_result")
    public Long getOrInsertInspResult(@RequestBody StoreInspectionPopupRequest request) {
        return storeInspectionPopupService.getOrInsertInspResultId(request);
    }




    /**
     * 점검 결과 임시저장 엔드포인트
     *
     * @param request StoreInspectionPopupRequest 객체
     * @return 성공 메시지
     */
    @PostMapping("/store_inspection_save")
    public ResponseEntity<String> storeInspectionSave(@RequestBody StoreInspectionPopupRequest request) {
        storeInspectionPopupService.insertInspectionResult(request);
        return ResponseEntity.ok("임시저장이 완료되었습니다.");
    }


}

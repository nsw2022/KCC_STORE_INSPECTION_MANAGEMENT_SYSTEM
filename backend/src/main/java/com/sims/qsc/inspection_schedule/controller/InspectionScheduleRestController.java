package com.sims.qsc.inspection_schedule.controller;

import com.sims.qsc.inspection_schedule.service.InspectionScheduleService;
import com.sims.qsc.inspection_schedule.vo.InspectionDetailsResponse;
import com.sims.qsc.inspection_schedule.vo.InspectionScheduleRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/qsc/inspection-schedule")
@Slf4j
public class InspectionScheduleRestController {

    private final InspectionScheduleService inspectionScheduleService;

    /**
     * @param storeNm 가맹점
     * @param brandNm 브랜드
     * @param scheduleDate 점검예정일
     * @param chklstNm 체크리스트명
     * @param inspector 점검자
     * @return 필터요소가 적용된 점검일정
     */
    @GetMapping("/schedule-list/filter")
    public ResponseEntity<?> selectFilteredInspectionScheduleList(
            @RequestParam(value = "storeNm", required = false) String storeNm,
            @RequestParam(value = "brandNm", required = false) String brandNm,
            @RequestParam(value = "scheduleDate", required = false) String scheduleDate,
            @RequestParam(value = "chklstNm", required = false) String chklstNm,
            @RequestParam(value = "inspector", required = false) String inspector,
            @RequestParam(value = "cntCd", required = false) String cntCd,
            @RequestParam(value = "frqCd" , required = false) String frqCd


    ) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentMbrNo = auth.getName();

            List<InspectionScheduleRequest> filteredSchedules = inspectionScheduleService.selectFilteredInspectionScheduleList(
                    storeNm,  brandNm, scheduleDate, chklstNm, inspector, cntCd, frqCd, currentMbrNo
            );
            return ResponseEntity.ok(filteredSchedules);
        } catch (Exception e) {
            log.error("Error fetching filtered inspection schedules", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    /**
     * 모든 가맹점 목록을 조회
     *
     * @return 가맹점 목록
     */
    @GetMapping("/stores")
    public ResponseEntity<List<String>> selectAllStores() {
        List<String> stores = inspectionScheduleService.selectAllStores();
        return ResponseEntity.ok(stores);
    }

    /**
     * 모든 브랜드 목록을 조회
     *
     * @return 브랜드 목록
     */
    @GetMapping("/brands")
    public ResponseEntity<List<String>> selectAllBrands() {
        List<String> brands = inspectionScheduleService.selectAllBrands();
        return ResponseEntity.ok(brands);
    }

    /**
     * 모든 체크리스트 목록을 조회
     *
     * @return 체크리스트 목록
     */
    @GetMapping("/checklists")
    public ResponseEntity<List<String>> selectAllChecklists() {
        List<String> checklists = inspectionScheduleService.selectAllChecklists();
        return ResponseEntity.ok(checklists);
    }

    /**
     * 모든 점검자 목록을 조회
     *
     * @return 점검자 목록
     */
    @GetMapping("/inspectors")
    public ResponseEntity<List<String>> selectAllInspectors() {
        List<String> inspectors = inspectionScheduleService.selectAllInspectors();
        return ResponseEntity.ok(inspectors);
    }

    @GetMapping("/bottom-checkLists")
    public ResponseEntity<List<String>> selectAllBottomCheckLists() {
        List<String> bottomCheckLists = inspectionScheduleService.selectBottomChkLst();
        return ResponseEntity.ok(bottomCheckLists);
    }

    @GetMapping("/bottom-INSP-TYPE")
    public ResponseEntity<List<String>> selectBottomINSPType() {
        List<String> bottomINSP = inspectionScheduleService.selectBottomINSP();
        return ResponseEntity.ok(bottomINSP);
    }

    /**
     * 특정 스토어의 검사 상세 정보를 조회
     *
     * @param storeId 조회할 가맹점의 ID
     * @return 가맹점별 체크리스트 조회
     */
    @GetMapping("/schedule-list/master-chklst/{storeId}")
    public ResponseEntity<?> selectInspectionDetail(@PathVariable Integer storeId) {
        try {
            List<InspectionDetailsResponse> inspectionDetails = inspectionScheduleService.selectInspectionDetails(storeId);
            return ResponseEntity.ok(inspectionDetails);
        } catch (Exception e) {
            log.error("storeId에 대한 검사 세부 정보 가져오기 오류 {}: {}", storeId, e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 오류가 발생했습니다.");
        }
    }

}

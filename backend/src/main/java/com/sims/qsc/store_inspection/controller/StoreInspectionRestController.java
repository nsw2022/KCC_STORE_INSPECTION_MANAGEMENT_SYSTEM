package com.sims.qsc.store_inspection.controller;

import com.sims.qsc.store_inspection.service.StoreInspectionPopup.StoreInspectionPopupService;
import com.sims.qsc.store_inspection.service.StoreInspectionService;
import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/filter")
@RequiredArgsConstructor
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
    public List<StoreInspectionPopupRequest> selectInspectionDetails(
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

}

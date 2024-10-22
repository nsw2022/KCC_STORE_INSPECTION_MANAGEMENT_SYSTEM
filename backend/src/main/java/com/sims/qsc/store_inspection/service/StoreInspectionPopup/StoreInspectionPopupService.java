package com.sims.qsc.store_inspection.service.StoreInspectionPopup;

import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;

import java.util.List;

public interface StoreInspectionPopupService {
    List<StoreInspectionPopupRequest> selectInspectionDetails(Long chklstId, String storeNm, String inspPlanDt);

    // 최근 점검 이력 조회 메서드 추가
    List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(String storeNm, String inspSttsCd);
}

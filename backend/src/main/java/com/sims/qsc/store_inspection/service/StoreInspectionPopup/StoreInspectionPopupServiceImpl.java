package com.sims.qsc.store_inspection.service.StoreInspectionPopup;

import com.sims.qsc.store_inspection.mapper.StoreInspectionPopupMapper;
import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreInspectionPopupServiceImpl implements StoreInspectionPopupService {
    private final StoreInspectionPopupMapper storeInspectionPopupMapper;

    @Override
    public List<StoreInspectionPopupRequest> selectInspectionDetails(Long chklstId, String storeNm, String inspPlanDt) {
        return storeInspectionPopupMapper.selectInspectionDetails(chklstId, storeNm, inspPlanDt);
    }

    @Override
    public List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(String storeNm, String inspSttsCd) {
        return storeInspectionPopupMapper.selectRecentInspectionHistory(storeNm, inspSttsCd);
    }

}

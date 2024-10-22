package com.sims.qsc.store_inspection.service;

import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;

import java.util.List;

public interface StoreInspectionService {
    List<StoreInspectionResponse> selectAllInspectionSchedules();

    StoreInspectionResponse selectInspectionByChklstId(String chklstId, String storeNm, String inspPlanDt);
}

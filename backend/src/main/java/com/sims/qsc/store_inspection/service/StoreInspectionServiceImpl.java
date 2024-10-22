package com.sims.qsc.store_inspection.service;

import com.sims.qsc.store_inspection.mapper.StoreInspectionMapper;
import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreInspectionServiceImpl implements StoreInspectionService {
    private final StoreInspectionMapper storeInspectionMapper;

    @Autowired
    public StoreInspectionServiceImpl(StoreInspectionMapper storeInspectionMapper) {
        this.storeInspectionMapper = storeInspectionMapper;
    }

    @Override
    public List<StoreInspectionResponse> selectAllInspectionSchedules() {
        return storeInspectionMapper.selectAllInspectionSchedules();
    }

    @Override
    public StoreInspectionResponse selectInspectionByChklstId(String chklstId, String storeNm, String inspPlanDt) {
        return storeInspectionMapper.selectInspectionByChklstId(chklstId, storeNm, inspPlanDt);
    }
}

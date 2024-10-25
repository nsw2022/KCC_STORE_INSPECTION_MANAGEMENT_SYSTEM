package com.sims.qsc.store_inspection.service;

import com.sims.qsc.store_inspection.vo.StoreAllLocationResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import com.sims.qsc.store_inspection.vo.StoreLocationResponse;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StoreInspectionService {
    List<StoreInspectionResponse> selectAllInspectionSchedules();

    StoreInspectionResponse selectInspectionByChklstId(String chklstId, String storeNm, String inspPlanDt);


    /**
     * @param mbrNo 로그인한 사용자 고유번호(아이디)
     * @return 금일 점검자의 가맹점 정보
     */
    List<StoreLocationResponse> selectInspectionsByInspector(@Param("mbrNo") String mbrNo);

    /**
     * @return 전체 점검 매장
     */
    List<StoreAllLocationResponse> selectAllInspectionMap(@Param("currentMbrNo") String currentMbrNo);
}

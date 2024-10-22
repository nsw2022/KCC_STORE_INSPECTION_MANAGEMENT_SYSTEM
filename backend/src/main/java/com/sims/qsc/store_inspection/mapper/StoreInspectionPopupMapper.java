package com.sims.qsc.store_inspection.mapper;

import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StoreInspectionPopupMapper {
    List<StoreInspectionPopupRequest> selectInspectionDetails(
            @Param("chklstId") Long chklstId,
            @Param("storeNm") String storeNm,
            @Param("inspPlanDt") String inspPlanDt
    );

    // 최근 점검 이력 조회 메서드 추가
    List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(
            @Param("storeNm") String storeNm,
            @Param("inspSttsCd") String inspSttsCd
    );
}

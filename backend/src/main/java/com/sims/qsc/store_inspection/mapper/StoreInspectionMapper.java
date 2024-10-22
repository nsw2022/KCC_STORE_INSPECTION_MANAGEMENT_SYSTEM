package com.sims.qsc.store_inspection.mapper;

import com.sims.qsc.store_inspection.vo.StoreInspectionResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StoreInspectionMapper {
    List<StoreInspectionResponse> selectAllInspectionSchedules();

    // 수정된 메서드
    StoreInspectionResponse selectInspectionByChklstId(@Param("chklstId") String chklstId,
                                                       @Param("storeNm") String storeNm,
                                                       @Param("inspPlanDt") String inspPlanDt);
}

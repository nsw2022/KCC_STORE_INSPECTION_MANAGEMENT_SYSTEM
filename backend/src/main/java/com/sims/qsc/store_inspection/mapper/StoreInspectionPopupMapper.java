package com.sims.qsc.store_inspection.mapper;

import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface StoreInspectionPopupMapper {
    List<StoreInspectionPopupResponse> selectInspectionDetails(
            @Param("chklstId") Long chklstId,
            @Param("storeNm") String storeNm,
            @Param("inspPlanDt") String inspPlanDt
    );

    // 최근 점검 이력 조회 메서드 추가
    List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(
            @Param("storeNm") String storeNm,
            @Param("inspSttsCd") String inspSttsCd
    );

    // INSP_RESULT 삽입
    void insertINSP_RESULT(StoreInspectionPopupRequest request);

    // EVIT_ANSW 삽입
    void insertEVIT_ANSW(StoreInspectionPopupRequest.SubcategoryInspection subcategory);

    // EVIT_VLT 삽입
    void insertEVIT_VLT(StoreInspectionPopupRequest.SubcategoryInspection subcategory);

    // EVIT_ANSW_IMG 삽입
    void insertEVIT_ANSW_IMG(Map<String, Object> params);

    // MBR_NO로 MBR_ID 조회
    @Select("SELECT MBR_ID FROM MBR WHERE MBR_NO = #{mbrNo}")
    Long selectMbrIdByMbrNo(@Param("mbrNo") String mbrNo);

    /**
     * 이미 존재하는 INSP_RESULT_ID 조회
     *
     * @param chklstId    체크리스트 ID
     * @param storeNm     가맹점명
     * @param inspPlanDt  점검 예정일
     * @return INSP_RESULT_ID 또는 null
     */
    Long selectExistingInspResultId(
            @Param("chklstId") Long chklstId,
            @Param("storeNm") String storeNm,
            @Param("inspPlanDt") String inspPlanDt
    );

}

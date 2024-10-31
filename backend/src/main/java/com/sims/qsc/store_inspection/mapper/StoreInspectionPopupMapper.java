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

    // EVIT_ANSW 병합
    void mergeEVIT_ANSW(StoreInspectionPopupRequest.SubcategoryInspection subcategory);

    // EVIT_VLT 병합
    void mergeEVIT_VLT(StoreInspectionPopupRequest.SubcategoryInspection subcategory);

    // EVIT_ANSW_IMG 병합
    void mergeEVIT_ANSW_IMG(Map<String, Object> params);


    // deleteUnmatchedEVIT_ANSW_IMG 메서드
    void deleteUnmatchedEVIT_ANSW_IMG(Map<String, Object> params);

    // 삭제할 이미지 조회
    List<String> selectUnmatchedEVIT_ANSW_IMGPaths(Map<String, Object> params);

    // MBR_NO로 MBR_ID 조회
    @Select("SELECT MBR_ID FROM MBR WHERE MBR_NO = #{mbrNo}")
    Long selectMbrIdByMbrNo(@Param("mbrNo") String mbrNo);


    /**
     * INSP_SCHD_ID로 기존 INSP_RESULT_ID 조회
     *
     * @param inspSchdId INSP_SCHD_ID
     * @return INSP_RESULT_ID 또는 null
     */
    StoreInspectionPopupRequest selectExistingInspResultIdBySchdId(@Param("inspSchdId") Long inspSchdId);




//    // 임시저장된 EVIT_ANSW 및 EVIT_ANSW_IMG 조회
//    List<StoreInspectionPopupResponse.EvitAnswImgVO> selectTemporaryAnswImg(
//            @Param("inspResultId") Long inspResultId,
//            @Param("creMbrId") Long creMbrId
//    );
//
//    // 임시저장된 EVIT_VLT, EVIT_ANSW, EVIT_ANSW_IMG 조회
//    List<StoreInspectionPopupResponse.EvitVltVO> selectTemporaryVlt(
//            @Param("inspResultId") Long inspResultId,
//            @Param("creMbrId") Long creMbrId
//    );
    List<StoreInspectionPopupResponse.TemporaryInspectionDetailsVO> selectTemporaryInspectionDetails(Map<String, Object> params);



}

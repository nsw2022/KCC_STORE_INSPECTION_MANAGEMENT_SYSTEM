package com.sims.qsc.store_inspection.service.StoreInspectionPopup;

import com.sims.qsc.store_inspection.vo.RecentInspectionHistoryResponse;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupRequest;
import com.sims.qsc.store_inspection.vo.StoreInspectionPopupResponse;

import java.util.List;

public interface StoreInspectionPopupService {

    /**
     * 점검 상세 조회
     *
     * @param chklstId    체크리스트 ID
     * @param storeNm     가맹점명
     * @param inspPlanDt  점검 예정일
     * @return 점검 상세 정보 리스트
     */
    List<StoreInspectionPopupResponse> selectInspectionDetails(Long chklstId, String storeNm, String inspPlanDt);

    /**
     * 최근 점검 이력 조회
     *
     * @param storeNm     가맹점명
     * @param inspSttsCd  점검 상태 코드
     * @return 최근 점검 이력 리스트
     */
    List<RecentInspectionHistoryResponse> selectRecentInspectionHistory(String storeNm, String inspSttsCd);


    /**
     * 점검 결과 삽입 또는 업데이트 (MERGE) (임시저장)
     *
     * @param request 점검 결과 요청 데이터
     */
    void insertInspectionResult(StoreInspectionPopupRequest request);

    /**
     * INSP_RESULT를 조회하거나, 존재하지 않으면 삽입 후 ID 반환
     *
     * @param request StoreInspectionPopupRequest 객체
     * @return INSP_RESULT_ID
     */
    Long getOrInsertInspResultId(StoreInspectionPopupRequest request);


    /**
     * 임시저장된 점검 결과 조회
     *
     * @param inspResultId 점검 결과 ID
     * @return 임시저장된 점검 결과 데이터
     */
    StoreInspectionPopupRequest getTemporaryInspection(Long inspResultId);

}

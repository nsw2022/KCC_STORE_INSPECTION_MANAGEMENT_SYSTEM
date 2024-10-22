package com.sims.qsc.inspection_schedule.service;

import com.sims.qsc.inspection_schedule.vo.InspectionDetailsBuilder;
import com.sims.qsc.inspection_schedule.vo.InspectionScheduleBuilder;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface InspectionScheduleService {
    /**
     * @param storeNm 가맹점
     * @param brandNm 브랜드
     * @param scheduleDate 점검예정일
     * @param chklstNm 체크리스트명
     * @param inspector 점검자
     * @return 필터 요소가 적용된 점검일정 목록
     */
    List<InspectionScheduleBuilder> getFilteredInspectionScheduleList(
            @Param("storeNm") String storeNm,
            @Param("brandNm") String brandNm,
            @Param("scheduleDate") String scheduleDate,
            @Param("chklstNm") String chklstNm,
            @Param("inspector") String inspector,
            @Param("cntCd") String cntCd,
            @Param("frqCd")String frqCd
    );
    /** @return 자동완성 가맹점 리스트 */
    List<String> selectAllStores();

    /** @return 자동완성 브랜드 리스트 */
    List<String> selectAllBrands();

    /** @return 자동완성 체크리스트 리스트 */
    List<String> selectAllChecklists();

    /** @return 자동완성 점검자 리스트 */
    List<String> selectAllInspectors();

    /**
     *
     * @param storeId 가맹점 번호 - 시퀀스
     * @return 가맹점별 체크 리스트, 체크리스트 문항과 점수
     */
    List<InspectionDetailsBuilder> getInspectionDetails(@Param("storeId") Integer storeId);
}

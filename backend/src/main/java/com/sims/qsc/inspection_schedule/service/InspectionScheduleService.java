package com.sims.qsc.inspection_schedule.service;

import com.sims.qsc.inspection_schedule.vo.*;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface InspectionScheduleService {
    /** 점검일정 목록조회
     * @param storeNm 가맹점
     * @param brandNm 브랜드
     * @param scheduleDate 점검예정일
     * @param chklstNm 체크리스트명
     * @param inspector 점검자
     * @param currentMbrNo 로그인사람의 회원고유번호
     * @return 필터 요소가 적용된 점검일정 목록
     */
    List<InspectionScheduleRequest> selectFilteredInspectionScheduleList(
            @Param("storeNm") String storeNm,
            @Param("brandNm") String brandNm,
            @Param("scheduleDate") String scheduleDate,
            @Param("chklstNm") String chklstNm,
            @Param("inspector") String inspector,
            @Param("cntCd") String cntCd,
            @Param("frqCd")String frqCd,
            @Param("currentMbrNo")String currentMbrNo
    );
    /**
     * @return 자동완성 가맹점 리스트
     */
    List<Map<String, Object>> selectAllStores(@Param("currentMbrNo") String currentMbrNo);


    /** @return 자동완성 브랜드 리스트 */
    List<String> selectAllBrands();

    /** @return 자동완성 체크리스트 리스트 */
    List<String> selectAllChecklists();

    /** @return 자동완성 점검자 리스트 */
    List<String> selectAllInspectors();

    /** @return 하단부분 자동완성  체크리스트 리스트 */
    List<Map<String, Object>> selectBottomChkLst();

    /** @return 하단부분 자동완성 점검유형 */
    List<String> selectBottomINSP();

    /**
     *
     * @param storeId 가맹점 번호 - 시퀀스
     * @return 가맹점별 체크 리스트, 체크리스트 문항과 점수
     */
    List<InspectionDetailsResponse> selectInspectionDetails(@Param("storeId") Integer storeId);

    /**
     * 점검 계획을 삽입하거나 업데이트하는 메서드
     *
     * @param inspectionPlans 저장할 점검 계획 목록
     */
    void insertOrUpdateInspectionPlans(@Param("list") List<InspectionPlan> inspectionPlans);

    /**
     * 점검 일정을 배치로 삽입하는 메서드
     *
     * @param schedules 저장할 점검 일정 목록
     */
    void insertInspectionSchedules(@Param("list") List<InspectionSchedule> schedules);


    /**
     *
     * @param inspPlanId 점검일정 시퀀스번호
     * @return 스케줄 상세보기
     */
    public InspectionSchedule  selectDetailSchedule(Integer inspPlanId);
    /**
     *
     * @param creMbrId 회원아이디
     * @return 회원정보
     */
    public MemberRequest selectMbrDetail(String creMbrId);

    /**
     *
     * @return 가장 최근의 점검 계획 시퀀슥밧
     */
    @Select("SELECT MAX(INSP_PLAN_ID) FROM INSP_PLAN")
    Integer getLastInspPlanSeq();
}

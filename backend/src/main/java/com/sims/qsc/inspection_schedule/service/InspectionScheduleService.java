package com.sims.qsc.inspection_schedule.service;

import com.sims.config.common.aop.SVInspectorRolCheck;
import com.sims.qsc.inspection_schedule.mapper.InspectionScheduleMapper;
import com.sims.qsc.inspection_schedule.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public interface  InspectionScheduleService {



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

    /** @return 자동완성 가맹점 리스트 */
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
    /** 점검 상세 리스트 */
    List<InspectionDetailsResponse> selectInspectionDetails(Integer storeId);

    /** 점검 계획 업데이트 */
    void updateInspectionPlans(InspectionPlan inspectionPlan);

    /** 점검 계획 삽입 */
    void insertInspectionPlans(InspectionPlan inspectionPlan);

    /** 점검 일정 업데이트 */
    void updateInspectionSchedules(InspectionSchedule inspectionSchedule);

    /** 점검 일정 삽입 */
    void insertInspectionSchedules(List<InspectionSchedule> schedules);


    /** 점검 일정 상세 조회 (INSP_PLAN_ID와 inspSchdId 기준) */
    List<InspectionSchedule> selectInspectionSchedulesByPlanIdAndDate(
            @Param("inspPlanId") int inspPlanId
    );

    @Transactional
    @SVInspectorRolCheck
    void insertOrUpdateInspectionPlans(List<InspectionPlan> inspectionPlans);

    /** 회원 상세 조회 */
    MemberRequest selectMbrDetail(@Param("creMbrNo") String creMbrNo);

    /**
     *
     * @param inspPlanId 시퀀스 번호
     * @return 점검계획 임시객체
     */
    @Select("SELECT * FROM INSP_PLAN WHERE INSP_PLAN_ID = #{inspPlanId}")
    InspectionPlan selectInspPlanById(int inspPlanId);

    /**
     *
     * @return 현재 INSP_SCHD시퀀스 최댓값 가져오는 값
     */
    @Select("SELECT INSP_SCHD_SEQ.NEXTVAL FROM DUAL")
    Integer getMaxInspSchdId();


    /**
     * 특정 inspPlanId에 해당하는 모든 점검 일정을 삭제하는 메서드
     *
     * @param inspPlanId 점검 계획 ID
     */
    void deleteInspectionSchedulesByPlanId(int inspPlanId);

    /**
     *
     * @param storeId 가맹점 시퀀스
     * @param inspPlanDt 점검일자
     * @return 중복 일정
     */
    int selectDuplicationSchedules(
            @Param("storeId") int storeId,
            @Param("frqCd") String frqCd,
            @Param("cntCd") String cntCd,
            @Param("inspPlanDt") String inspPlanDt
    );
    /**
     *
     * @param inspSchdId - 일정 시퀀스 번호
     * @return 점검 결과 갯수
     */
    @Select("SELECT " +
            "COUNT(*) " +
            "FROM INSP_RESULT ISR " +
            "INNER JOIN INSP_SCHD ISC " +
            "ON ISR.INSP_SCHD_ID = ISC.INSP_SCHD_ID " +
            "WHERE ISR.INSP_SCHD_ID = #{inspSchdId}")
    int selectInspResultById(int inspSchdId);

    /**
     * 특정 점검 계획의 상태를 0으로 업데이트합니다.
     *
     * @param inspPlanId 업데이트할 inspPlanId
     * @return 업데이트된 행의 수
     */
    @Update({
            "UPDATE INSP_PLAN",
            "SET INSP_PLAN_STTS_W = 0",
            "WHERE INSP_PLAN_ID = #{inspPlanId}"
    })
    int updatePlan(int inspPlanId);


    /**
     * 여러 InspectionPlan의 상태를 0으로 업데이트합니다.
     *
     * @param inspectionPlans 업데이트할 InspectionPlan 리스트
     */
    void deleteInspectionSchedules(List<InspectionPlan> inspectionPlans);



    /**
     * 활성화된 모든 InspectionPlan을 조회합니다.
     *
     * @return 활성화된 InspectionPlan 리스트
     */
    List<InspectionPlan> selectActiveInspectionPlans();




}

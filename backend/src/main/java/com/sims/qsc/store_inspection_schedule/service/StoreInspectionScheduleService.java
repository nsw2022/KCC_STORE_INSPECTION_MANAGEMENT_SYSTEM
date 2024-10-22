package com.sims.qsc.store_inspection_schedule.service;

import java.util.List;

import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleResponse;

public interface StoreInspectionScheduleService {
	/**
	 * 
	 * @return 달력 일정 영역에서 스케줄 표시
	 * @throws Exception
	 */
	public List<StoreInspectionScheduleResponse> selectScheduleList() throws Exception;
	
	/**
	 * 가맹점과 점검계획일정을 통해 해당 가맹점의 체크리스트 점검사항을 알 수 있음.
	 * @param {string} storeNm 가맹점명
	 * @param {string} inspPlanDt 점검계획일정
	 * @return storeNm과 inspPlanDt를 받아와 StoreInspectionSchedule List로 리턴
	 */
	public List<StoreInspectionScheduleRequest> selectScheduleListByStoreNmAndInspPlanDt (String storeNm, String inspPlanDt);
	
	
	/**
	 * 점검 일정이 있는 모든 점검자 표시
	 * @return 모든 점검자 List<String>으로 리턴
	 */
	public List<String> selectInspectorList();
	
	/**
	 * 점검 일정에 있는 모든 점검 유형 표시
	 * @return 모든 점검 유형 List<String>으로 리턴
	 */
	public List<String> selectInspectionTypeList();
	
	/**
	 * 사원번호와 점검유형코드를 검색한 후에 해당 조건에 맞는 점검자의 일정 보여주기
	 * @param {string} mbrNo 사원번호
	 * @param {string} inspTypeCd 점검유형코드
	 * @return List<StoreInspectionSchedule>
	 */
	public List<StoreInspectionScheduleRequest> selectScheduleListByMbrNoAndInspTypeCd(String inspMbrNo, String inspTypeCd, String svMbrNo);
	
	/**
	 * 사용자에 따라 점검자 목록이 달라짐
	 * @param {string} svMbrNo SV 사원번호
	 * @param {string} inspMbrNo 점검자 사원번호
	 * @return List<String>
	 */
	public List<String> selectInspectorListByMbr(String svMbrNo, String inspMbrNo);
	
}

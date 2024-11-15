package com.sims.qsc.store_inspection_schedule.service;

import java.util.List;

import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleResponse;


/**
 * @Description 가맹점 점검 일정 조회 Service
 * @author 원승언
 * @Date 2024.10.22
 *
 */
public interface StoreInspectionScheduleService {
	/**
	 * 
	 * @return 달력 일정 영역에서 스케줄 표시
	 * @throws Exception
	 */
	public List<StoreInspectionScheduleResponse> selectScheduleList() throws Exception;
	
	/**
	 * 가맹점과 점검계획일정을 통해 해당 가맹점의 체크리스트 점검사항을 알 수 있음.
	 * @param storeNm 		// 가맹점명
	 * @param inspPlanDt 	// 점검계획일정
	 * @return 가맹점과 점검계획일정을 통해 점검사항 조회
	 */
	public List<StoreInspectionScheduleRequest> selectScheduleListByStoreNmAndInspPlanDt (String storeNm, String inspPlanDt);
	
	
	/**
	 * 점검 일정이 있는 모든 점검자 표시
	 * @return 모든 점검자 목록 표시
	 */
	public List<String> selectInspectorList();
	
	/**
	 * 점검 일정에 있는 모든 점검 유형 표시
	 * @return 모든 점검 유형 목록 표시
	 */
	public List<String> selectInspectionTypeList(String svMbrNo, String inspMbrNo);
	
	/**
	 * 사원번호와 점검유형코드를 검색한 후에 해당 조건에 맞는 점검자의 일정 보여주기
	 * @param inspMbrNo 	// 점검자 사원번호
	 * @param inspTypeCd 	// 점검유형코드
	 * @param svMbrNo		// SV 사원번호
	 * @return 사용자에 따라 점검자 및 점검유형코드 검색 후 조건에 맞는 일정 다르게 보여주기 
	 */
	public List<StoreInspectionScheduleRequest> selectScheduleListByMbrNoAndInspTypeCd(String inspMbrNo, String inspTypeCd, String svMbrNo);
	
	/**
	 * 사용자에 따라 점검자 목록이 달라짐
	 * @param svMbrNo		// SV 사원번호
	 * @param inspMbrNo 	// 점검자 사원번호
	 * @return 사용자에 따라 점검자 목록 다르게 표시
	 */
	public List<String> selectInspectorListByMbr(String svMbrNo, String inspMbrNo);
	
}

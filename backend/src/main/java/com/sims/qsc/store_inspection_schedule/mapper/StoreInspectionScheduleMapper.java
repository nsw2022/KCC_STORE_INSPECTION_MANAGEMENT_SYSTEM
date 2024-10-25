package com.sims.qsc.store_inspection_schedule.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleResponse;


/**
 * @Description 가맹점 점검 일정 Mapper
 * @Author 원승언
 * @Date 2024.10.22
 */
@Mapper
public interface StoreInspectionScheduleMapper {
	/**
	 * 점검 일정 내용 달력에 표시 
	 * @return 모든 점검 일정 내용 
	 */
	public List<StoreInspectionScheduleResponse> selectStoreInspectionSchedule();
	

	/**
	 * 가맹점과 점검계획일정을 통해 해당 가맹점의 체크리스트 점검사항을 알 수 있음.
	 * @param storeNm		// 가맹점명
	 * @param inspPlanDt	// 점검계획일정
	 * @return 가맹점과 점검계획일정을 통해서 체크리스트 점검사항 조회
	 */
	public List<StoreInspectionScheduleRequest> selectStoreInspectionSchedule(@Param("storeNm") String storeNm, 
																	@Param("inspPlanDt") String inspPlanDt);

	
	/**
	 * 점검 일정에서 모든 점검자들을 볼 수 있음.
	 * @return 점검자들의 이름 목록
	 */
	public List<String> selectInspectorList();
	
	/**
	 * 점검 일정에서 모든 점검 유형을 볼 수 있음
	 * @return 점검유형 종류 목록
	 */
	public List<String> selectInspectionType(@Param("svMbrNo") String svMbrNo, @Param("inspMbrNo") String inspMbrNo);
	

	/**
	 * 점검유형 혹은 점검자 아니면 둘 다 검색하여 그에 맞게 달력 일정 표시 && 사용자의 사원번호에 따라 점검일정 다르게 보여주기
	 * @param mbrNo			// 사원번호
	 * @param inspTypeCd	// 점검유형
	 * @return 점검 유형 혹은 점검자 검색 후 조건에 맞는 일정 표시
	 */
	public List<StoreInspectionScheduleRequest> selectStoreInspectionScheduleByFilter(@Param("inspMbrNo") String mbrNo,
																			@Param("inspTypeCd") String inspTypeCd,
																			@Param("svMbrNo") String svMbrNo);
	/**
	 * 페이지에 들어온 사용자에 따라 점검자 검색 목록이 달라짐
	 * @param svMbrNo		// SV 사원번호
	 * @param inspMbrNo		// 점검자 사원번호
	 * @return 사용자에 따라 점검자 목록 다르게 보여줌 
	 */
	public List<String> selectInspectorList(@Param("svMbrNo") String svMbrNo, @Param("inspMbrNo") String inspMbrNo);
}

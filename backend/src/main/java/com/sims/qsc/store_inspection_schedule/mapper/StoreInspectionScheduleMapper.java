package com.sims.qsc.store_inspection_schedule.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleRequest;
import com.sims.qsc.store_inspection_schedule.vo.StoreInspectionScheduleResponse;



@Mapper
public interface StoreInspectionScheduleMapper {
	/**
	 * 점검 일정 내용 달력에 표시 
	 * @return StoreInspectionSchedule을 List로 리턴
	 */
	public List<StoreInspectionScheduleResponse> selectStoreInspectionSchedule();
	

	/**
	 * 가맹점과 점검계획일정을 통해 해당 가맹점의 체크리스트 점검사항을 알 수 있음.
	 * @param {string} storeNm 가맹점명
	 * @param {string} inspPlanDt 점검계획일정
	 * @return storeNm과 inspPlanDt를 받아와 StoreInspectionSchedule List로 리턴
	 */
	public List<StoreInspectionScheduleRequest> selectStoreInspectionSchedule(@Param("storeNm") String storeNm, 
																	@Param("inspPlanDt") String inspPlanDt);

	
	/**
	 * 점검 일정에서 모든 점검자들을 볼 수 있음.
	 * @return 점검자들의 이름을 List로 리턴.
	 */
	public List<String> selectInspectorList();
	
	/**
	 * 점검 일정에서 모든 점검 유형을 볼 수 있음
	 * @return 점검유형 종류들을 LIST로 리턴
	 */
	public List<String> selectInspectionType();
	

	/**
	 * 점검유형 혹은 점검자 아니면 둘 다 검색하여 그에 맞게 달력 일정 표시 && 사용자의 사원번호에 따라 점검일정 다르게 보여주기
	 * @param {string} mbrNo 사원번호
	 * @param {string} inspTypeCd 점검유형
	 * @return mbrNo와 inspTypeCd 둘 다 받거나 하나만 받아와서 동적으로 처리하여 StoreInspectionSchedule List로 리턴
	 */
	public List<StoreInspectionScheduleRequest> selectStoreInspectionScheduleByFilter(@Param("inspMbrNo") String mbrNo,
																			@Param("inspTypeCd") String inspTypeCd,
																			@Param("svMbrNo") String svMbrNo);
	/**
	 * 페이지에 들어온 사용자에 따라 점검자 검색 목록이 달라짐
	 * @param {string} svMbrNo SV 사원번호
	 * @param {string} inspMbrNo 점검자 사원번호
	 * @return List<String>
	 */
	public List<String> selectInspectorList(@Param("svMbrNo") String svMbrNo, @Param("inspMbrNo") String inspMbrNo);
}

package com.sims.qsc.store_inspection_schedule.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Description 가맹점 점검 일정 조회
 * @author 원승언
 * @Date 2024.10.22
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreInspectionScheduleResponse {
	private String inspMbrNo;	// 점검자 사원번호
	private String svMbrNo;		// SV 사원번호
	private String storeNm;		// 가맹점명
	private String mbrNm;		// 점검자명
	private String chklstNm;	// 체크리스트명
	private String inspTypeCd;	// 점검 유형
	private String inspPlanDt;	// 점검계획일
}

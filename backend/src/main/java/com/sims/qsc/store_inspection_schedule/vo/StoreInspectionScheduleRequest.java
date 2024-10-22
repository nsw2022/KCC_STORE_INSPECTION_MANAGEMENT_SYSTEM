package com.sims.qsc.store_inspection_schedule.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreInspectionScheduleRequest {
	private String inspMbrNo;	// 점검자 사원번호
	private String svMbrNo;		// SV 사원번호
	private String storeNm;		// 가맹점명
	private String mbrNm;		// 점검자명
	private String chklstNm;	// 체크리스트명
	private String inspTypeCd;	// 점검 유형
	private String inspPlanDt;	// 점검계획일
}

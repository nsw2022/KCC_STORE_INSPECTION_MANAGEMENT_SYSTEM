package com.sims.qsc.store_inspection_schedule.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StoreInspectionSchedule {
	private String inspMbrNo;
	private String svMbrNo;
	private String storeNm;
	private String mbrNm;
	private String chklstNm;
	private String inspTypeCd;
	private String inspPlanDt;
}

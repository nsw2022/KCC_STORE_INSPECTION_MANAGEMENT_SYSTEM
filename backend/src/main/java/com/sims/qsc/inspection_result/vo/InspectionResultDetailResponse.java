package com.sims.qsc.inspection_result.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class InspectionResultDetailResponse {
	private int inspResultId;
	private String storeNm;
	private String chklstNm;
	private String brandNm;
	private String inspTypeNm;
	private String mbrNm;
	private String inspComplTm;
	private int totalPenalty;
	private int totalBsnSspn;
	
}

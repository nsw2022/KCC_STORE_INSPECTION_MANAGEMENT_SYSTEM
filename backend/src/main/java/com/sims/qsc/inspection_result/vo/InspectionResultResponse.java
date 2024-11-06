package com.sims.qsc.inspection_result.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @Description 가맹점 점검 결과 페이지에서 가맹점 점검결과 목록 보여줌
 * @author 원승언
 * @Date 2024.10.23
 *
 */

@Getter
@ToString
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InspectionResultResponse {
	private int inspResultId;		// 점검결과 ID
	private String storeNm;			// 가맹점명
	private String brandNm;			// 브랜드명
	private String chklstNm;		// 체크리스트명
	private String inspTypeNm;		// 점검유형명
	private String inspComplTm;		// 점검완료일
	private String mbrNm;			// 점검자명
}

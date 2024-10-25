package com.sims.qsc.store_inspection.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 *  @Description 점검 팝업
 *  @Author 이지훈
 *  @Date 2024.10.21
 *
 *  @field  String chklstNm - 체크리스트 이름
 *  @field  String inspPlanDt - 점검 예정일
 *  @field  String mbrNm - 점검자 이름
 *  @field  Integer totalScore - 총 점수
 */

@Getter
@Setter
@Builder
public class RecentInspectionHistoryResponse {
    private String chklstNm;       // 체크리스트 이름
    private String inspPlanDt;     // 점검 예정일
    private String mbrNm;          // 점검자 이름
    private Integer totalScore;    // 총 점수
}

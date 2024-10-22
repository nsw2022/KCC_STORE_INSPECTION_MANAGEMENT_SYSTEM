package com.sims.qsc.store_inspection.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
/**
 * 최근 점검이력 확인 vo
 */
public class RecentInspectionHistoryResponse {
    private String chklstNm;       // 체크리스트 이름
    private String inspPlanDt;     // 점검 예정일
    private String mbrNm;          // 점검자 이름
    private Integer totalScore;    // 총 점수
}

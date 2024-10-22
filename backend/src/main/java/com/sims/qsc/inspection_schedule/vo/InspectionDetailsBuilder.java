package com.sims.qsc.inspection_schedule.vo;

import lombok.*;

/**
 * /qsc/inspection-schedule/schedule-list 경로의 중간 가맹점별 체크리스트 조회
 */
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionDetailsBuilder {
    private Integer storeId;
    private String storeNm;
    private Integer inspPlanId;
    private String frqCd;
    private Integer chklstId;
    private String chklstNm;
    private Integer ctgId;
    private String ctgNm;
    private Integer evitId;
    private String evitContent;
    private Integer score;

}

package com.sims.qsc.inspection_schedule.vo;


import lombok.*;

/**
 * @Description 가맹점 일정 동적 관리
 * @Author 노승우
 * @Date 2024.10.31
 */
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionPlan {
    private Integer inspPlanId;
    private Integer chklstId;
    private String frqCd;
    private String cntCd;
    private String slctDt;
    private String week;
    private String inspPlanUseW;
    private Integer creMbrId;
    private String creTm;
    private Integer updMbrId;
    private String updTm;
    private String inspPlanSttsW;
    private String inspPlanDt;
    private Integer storeId;
    private int inspSchdId;
}

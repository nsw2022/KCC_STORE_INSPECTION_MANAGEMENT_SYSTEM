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
    private String inspPlanSttsW;
    private String creMbrId;
    private String updMbrId;
    private Integer storeId;
    private String creTm;
    private String updTm;
    private String inspPlanDt;
    private String mbrNo;
}

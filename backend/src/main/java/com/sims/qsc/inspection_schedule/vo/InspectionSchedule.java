package com.sims.qsc.inspection_schedule.vo;

import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.*;

/**
 * @Description 가맹점 계획 동적 관리
 * @Author 노승우
 * @Date 2024.10.31
 */
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionSchedule {
    private Integer inspSchdId;
    private Integer inspPlanId;
    private Integer storeId;
    private String inspPlanDt;
    private String inspSttsCd;
    private Integer creMbrId;
    private String creTm;
    private Integer updMbrId;
    private String updTm;
    private String inspSchdSttsW;

}

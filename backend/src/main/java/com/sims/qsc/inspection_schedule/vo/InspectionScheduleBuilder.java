package com.sims.qsc.inspection_schedule.vo;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * /qsc/inspection-schedule/schedule-list 경로의 상단 검색을 받는 객체
 */
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionScheduleBuilder {
    private String storeNm;
    private Integer storeId;
    private String brandNm;
    private String chklstNm;
    private String inspPlanDt;
    private String mbrNm;
    private String cntCd;
    private String frqCd;
}

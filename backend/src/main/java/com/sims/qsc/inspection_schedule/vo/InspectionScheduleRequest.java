package com.sims.qsc.inspection_schedule.vo;

import lombok.*;

/**
 * @Description 가맹점 점검 계획 관리
 * @Author 노승우
 * @Date 2024.10.21
 */
@Getter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InspectionScheduleRequest {
    private String storeNm; // 가맹점이름
    private Integer storeId; // 가맹점 고유번호
    private String brandNm; // 브랜드이름
    private String chklstNm; // 체크리스트명
    private String inspPlanDt; // 점검예정일
    private String mbrNm; // 회원번호
    private String cntCd; // 횟수
    private String frqCd; // 빈도
}

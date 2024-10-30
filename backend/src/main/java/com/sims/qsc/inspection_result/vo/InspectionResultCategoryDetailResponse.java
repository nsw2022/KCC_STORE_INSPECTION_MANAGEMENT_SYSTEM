package com.sims.qsc.inspection_result.vo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class InspectionResultCategoryDetailResponse {
    private String categoryNm;
    private int categoryStndScore;
    private int totalScore;
    private int profitCnt;
    private int nonProfitCnt;
    private int totalEvaluationCnt;
    private List<InspectionResultSubCategoryDetailResponse> subcategories;

}

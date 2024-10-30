package com.sims.qsc.inspection_result.vo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class InspectionResultSubCategoryDetailResponse {
    private int seq;
    private String subCtgNm;
    private List<InspectionResultSubCategoriesQuestionsResponse> questions;
}

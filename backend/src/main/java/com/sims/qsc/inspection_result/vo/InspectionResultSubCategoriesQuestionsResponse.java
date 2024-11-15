package com.sims.qsc.inspection_result.vo;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class InspectionResultSubCategoriesQuestionsResponse {
    private int evitId;
    private int vltId;
    private String questionContent;
    private int questionSeq;
    private int score;
    private int receivedScore;
    private int penalty;
    private int bsnSspnDaynum;
    private String questionAnswContent;
    private List<InspectionResultAnswImgResponse> images;
    private String vltPlcNm;
    private String pdtNmDtplc;
    private String vltContent;
    private String cauPvdNm;
    private int vltCnt;
    private String vltCause;
    private String instruction;
}

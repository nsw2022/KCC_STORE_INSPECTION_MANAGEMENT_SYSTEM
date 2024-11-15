package com.sims.qsc.inspection_result.vo;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Builder
@Getter
@ToString
public class InspectionResultRequest {
    private String storeNm;
    private String brandNm;
    private String inspComplTm;
    private String chklstNm;
    private String inspTypeNm;
    private String mbrNm;
    private String mbrNo;
}

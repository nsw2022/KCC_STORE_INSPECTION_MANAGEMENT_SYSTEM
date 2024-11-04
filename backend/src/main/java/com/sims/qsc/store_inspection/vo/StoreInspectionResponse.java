package com.sims.qsc.store_inspection.vo;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreInspectionResponse {
    private Long mbrId;
    private String mbrNm;
    private String mbrNo;
    private String chklstNm;
    private String chklstId;
    private String storeNm;
    private String inspPlanDt;
    private String inspSttsCd;
    private String inspResultId;
}

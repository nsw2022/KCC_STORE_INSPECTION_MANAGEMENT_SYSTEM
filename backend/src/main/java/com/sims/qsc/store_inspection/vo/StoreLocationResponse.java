package com.sims.qsc.store_inspection.vo;


import lombok.*;


/**
 * @Description 금일 점검자의 가맹점 정보
 * @Author 노승우
 * @Date 2024.10.23
 *
 */
@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreLocationResponse {
    private String mbrId;
    private String mbrNm;
    private String mbrNo;
    private String chklstNm;
    private String chklstId;
    private String storeNm;
    private String inspPlanDt;
    private String inspSttsCd;
    private String latitude;
    private String longitude;

}

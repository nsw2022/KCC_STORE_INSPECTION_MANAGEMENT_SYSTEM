package com.sims.master.store_manage.vo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreModalResponse {
    private int storeId;
    private String brandNm;
    private String storeNm;
    private String brn;
    private String brdPath;
    private String storeAddr;
    private String openHm;
    private String ownNm;
    private String ownTel;
    private String svMbrNm;
    private String svMbrNo;
    private String inspMbrNm;
    private String inspMbrNo;
    private String storeBsnSttsNm;
}

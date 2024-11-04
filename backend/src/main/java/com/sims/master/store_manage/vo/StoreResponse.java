package com.sims.master.store_manage.vo;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class StoreResponse {
    private int storeId;
    private String brandNm;
    private String storeNm;
    private String brn;
    private String openHm;
    private String ownNm;
    private String svMbrNm;
    private String inspMbrNm;
    private String storeBsnSttsNm;
}

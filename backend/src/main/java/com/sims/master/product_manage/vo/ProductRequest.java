package com.sims.master.product_manage.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProductRequest {
    private int pdtId;
    private String brandNm;
    private String pdtNm;
    private int pdtPrice;
    private int expDaynum;
    private String pdtSellSttsNm;
    private String mbrNo;
}

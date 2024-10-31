package com.sims.master.product_manage.vo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProductResponse {
    private int pdtId;
    private String brandNm;
    private String pdtNm;
    private int pdtPrice;
    private int expDaynum;
    private String pdtSellSttsNm;
}

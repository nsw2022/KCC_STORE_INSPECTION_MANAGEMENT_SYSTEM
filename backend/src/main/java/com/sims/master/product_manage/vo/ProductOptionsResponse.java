package com.sims.master.product_manage.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ProductOptionsResponse {
    private List<String> pdtNmList;
    private List<String> brandNmList;
    private List<String> pdtSellSttsNmList;
}

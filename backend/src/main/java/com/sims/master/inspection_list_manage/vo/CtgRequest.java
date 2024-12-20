package com.sims.master.inspection_list_manage.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CtgRequest {
    private String ctgId;
    private String ctgNm;
    private String chklstId;
    private String stndScore;
    private String ctgUseW;
    private int seq;
    private String creMbrId;
}

package com.sims.master.inspection_list_manage.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SubCtgRequest {
    private int masterCtgId; // 대분류ID
    private String ctgId; // 중분류ID
    private String ctgNm;
    private int chklstId;
    private String ctgUseW;
    private int stndScore;
    private int seq;
    private String creMbrId;
}

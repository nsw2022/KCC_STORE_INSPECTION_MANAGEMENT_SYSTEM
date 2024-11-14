package com.sims.master.checklist_manage.vo;

import lombok.Data;

@Data
public class Category {
    private Long ctgId;
    private String ctgNm;
    private String chklstId;
    private Long masterCtgId;
    private String ctgUseW;
    private String seq;
    private String stndScore;
    private String creMbrId;

    private Long newCtgId;
}

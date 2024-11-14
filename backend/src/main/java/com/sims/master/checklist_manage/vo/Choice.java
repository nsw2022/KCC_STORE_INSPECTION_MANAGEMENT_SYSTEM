package com.sims.master.checklist_manage.vo;

import lombok.Data;

@Data
public class Choice {
    private Long chclstId;
    private Long evitId;
    private String chclstContent;
    private String nprfsCd;
    private String prfW;
    private String score;
    private String penalty;
    private String bsnSspnDaynum;
    private String evitChclstUseW;
    private String chclstSeq;
    private String creMbrId;
}

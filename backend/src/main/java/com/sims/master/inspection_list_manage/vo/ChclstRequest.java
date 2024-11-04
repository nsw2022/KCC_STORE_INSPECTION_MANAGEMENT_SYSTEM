package com.sims.master.inspection_list_manage.vo;

import lombok.Data;

@Data
public class ChclstRequest {
    private String chclstId;
    private int evitId;
    private String chclstContent;
    private String nprfsCd;
    private String prfW;
    private int score;
    private int penalty;
    private int bsnSspnDaynum;
    private String evitChclstUseW;
    private int chclstSeq;
    private String creMbrId;
}

package com.sims.master.inspection_list_manage.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChclstResponse {
    private String chclstId;
    private String chclstContent;
    private String nprfsCd;
    private String prfW;
    private String score;
    private String penalty;
    private String bsnSspnDaynum;
    private String evitChclstUseW;
    private String chclstSeq;
}

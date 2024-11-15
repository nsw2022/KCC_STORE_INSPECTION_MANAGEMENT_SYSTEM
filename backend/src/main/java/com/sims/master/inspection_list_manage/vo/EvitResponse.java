package com.sims.master.inspection_list_manage.vo;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EvitResponse {
    private String evitId;
    private String evitNm;
    private String evitTypeNm;
    private String score;
    private String chklstEvitUseW;
    private String seq;
}

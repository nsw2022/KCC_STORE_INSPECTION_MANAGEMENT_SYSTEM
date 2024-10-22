package com.sims.master.checklist_manage.vo;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class ChecklistResponse {
    private int chklstId;
    private String brandNm;
    private String masterChklstNm;
    private String chklstNm;
    private String chklstUseW;
    private String inspTypeNm;
    private String creTm;
}

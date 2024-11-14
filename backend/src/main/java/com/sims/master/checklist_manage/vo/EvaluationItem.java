package com.sims.master.checklist_manage.vo;

import lombok.Data;

@Data
public class EvaluationItem {
    private Long evitId;             // 평가항목 ID
    private Long ctgId;              // 중분류 ID
    private String evitContent;      // 평가항목 내용
    private String evitTypeCd;       // 평가항목 유형 코드
    private String score;            // 점수
    private String chklstEvitUseW;   // 평가항목 사용 여부
    private String evitSeq;          // 평가항목 순서
    private String creMbrId;         // 생성자 ID
}

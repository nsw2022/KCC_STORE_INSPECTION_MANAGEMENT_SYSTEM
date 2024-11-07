package com.sims.master.checklist_manage.vo;

import lombok.*;

/**
 * @Description 체크리스트 목록 response를 위한 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Getter
@Setter
@NoArgsConstructor
public class ChecklistResponse {
    private int chklstId; // 체크리스트 ID
    private String brandNm; // 브랜드 이름
    private String masterChklstNm; // 마스터 체크리스트 이름
    private String chklstNm; // 체크리스트 이름
    private String masterChklstW; // 마스터 체크리스트 여부
    private String chklstUseW; // 체크리스트 사용 여부
    private String inspTypeNm; // 점검 유형 이름
    private String creTm; // 생성일자
}

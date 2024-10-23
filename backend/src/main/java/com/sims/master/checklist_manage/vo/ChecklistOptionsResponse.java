package com.sims.master.checklist_manage.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
/**
 * @Description 체크리스트 옵션(브랜드 이름, 점검 유형, 체크리스트 이름)을 담은 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Getter
@Setter
@Builder
public class ChecklistOptionsResponse {
    private List<String> brandOptions; // 브랜드 이름 리스트
    private List<String> inspTypeOptions; // 점검유형 리스트
    private List<String> checklistOptions; // 체크리스트 이름 리스트
}

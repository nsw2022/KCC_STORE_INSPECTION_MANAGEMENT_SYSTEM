package com.sims.master.checklist_manage.vo;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @Description 체크리스트 삭제 할 ID를 담은 VO 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChecklistDeleteRequest {
    private int chklstId; // 체크리스트 ID
}

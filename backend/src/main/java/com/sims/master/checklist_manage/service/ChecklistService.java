package com.sims.master.checklist_manage.service;

import com.sims.master.checklist_manage.vo.ChecklistDeleteRequest;
import com.sims.master.checklist_manage.vo.ChecklistOptionsResponse;
import com.sims.master.checklist_manage.vo.ChecklistResponse;

import java.util.List;
/**
 * @Description 체크리스트 관리 서비스
 * @Author 유재원
 * @Date 2023.10.23
 */
public interface ChecklistService {
    /**
     * 체크리스트 전체 조회
     * @return 체크리스트 전체 목록
     */
    public List<ChecklistResponse> selectChecklistAll();

    /**
     * 체크리스트 삭제
     * @param checklistDeleteRequest
     * @return 삭제된 데이터 갯수
     */
    public int deleteChecklistByChklstId(List<ChecklistDeleteRequest> checklistDeleteRequest);

    /**
     * 체크리스트 옵션 조회
     * @return 브랜드, 체크리스트, 점검유형
     */
    public ChecklistOptionsResponse selectChecklistOptions();
}

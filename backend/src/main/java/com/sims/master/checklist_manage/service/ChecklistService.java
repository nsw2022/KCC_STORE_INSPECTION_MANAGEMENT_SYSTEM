package com.sims.master.checklist_manage.service;

import com.sims.master.checklist_manage.vo.*;

import java.util.List;
import java.util.Map;

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
    public List<ChecklistResponse> selectChecklistAll(ChecklistRequest checklistRequest);

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

    /**
     * 체크리스트 등록/수정
     * @param checklistRequests
     * @return 등록/수정된 데이터 갯수
     */
    public int insertOrUpdateChecklist(List<ChecklistRequest> checklistRequests);


    /**
     * 체크리스트 미리보기 조회
     * @param chklstNm
     * @return 체크리스트 미리보기
     */
    public ChecklistPreviewResponse getComplianceData(String chklstNm);
}

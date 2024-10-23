package com.sims.master.checklist_manage.mapper;

import com.sims.master.checklist_manage.vo.ChecklistDeleteRequest;
import com.sims.master.checklist_manage.vo.ChecklistResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Description 체크리스트 관리 매퍼
 * @Author 유재원
 * @Date 2024.10.23
 */
@Mapper
public interface ChecklistMapper {
    /**
     * DB에서 체크리스트 전체 목록 조회
     * @return ChecklistResponse 체크리스트 전체 목록 리스트
     */
    public List<ChecklistResponse> selectChecklistAll();

    /**
     * DB에서 체크리스트 삭제
     * @param checklistDeleteRequests 체크리스트 삭제 요청 리스트
     * @return 삭제된 항목의 수
     */
    public int deleteChecklistByChklstId(List<ChecklistDeleteRequest> checklistDeleteRequests);

    /**
     * DB에서 브랜드 이름 전체 조회
     * @return 브랜드 이름 전체 리스트
     */
    public List<String> selectBrandOptions();

    /**
     * DB에서 점검 유형 전체 조회
     * @return 점검 유형 전체 리스트
     */
    public List<String> selectInspTypeOptions();

    /**
     * DB에서 체크리스트 이름 전체 조회
     * @return 체크리스트 이름 전체 리스트
     */
    public List<String> selectChecklistOptions();

    public List<Integer> selectChklstIdByChklstIdAndChklstUseW(List<ChecklistDeleteRequest> checklistDeleteRequest);
}

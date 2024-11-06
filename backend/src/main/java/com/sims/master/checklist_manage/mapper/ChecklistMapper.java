package com.sims.master.checklist_manage.mapper;

import com.sims.master.checklist_manage.vo.ChecklistDeleteRequest;
import com.sims.master.checklist_manage.vo.ChecklistPreviewResponse;
import com.sims.master.checklist_manage.vo.ChecklistRequest;
import com.sims.master.checklist_manage.vo.ChecklistResponse;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

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
    public List<ChecklistResponse> selectChecklistAll(ChecklistRequest checklistRequest);

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

    /**
     * 체크리스트 사용 여부 조회
     * @param checklistDeleteRequest
     * @return
     */
    public List<Integer> selectChklstIdByChklstIdAndChklstUseW(List<ChecklistDeleteRequest> checklistDeleteRequest);

    /**
     * 체크리스트 저장 / 수정
     * @param checklistRequests
     * @return 저장 / 수정된 데이터 갯수
     */
    public int insertOrUpdateChecklist(List<ChecklistRequest> checklistRequests);

    /**
     * 체크리스트 미리보기
     * @param chklstNm 체크리스트 이름
     * @return 체크리스트 미리보기 데이터
     */
    public List<Map<String, Object>> selectChecklistPreview(String chklstNm);

    /**
     * 체크리스트 사용 여부 수정
     * @Param chklstId 체크리스트 Id
     * @return 수정된 데이터 갯수
     */
    public int updateChklstUseW(int chklstId);

}

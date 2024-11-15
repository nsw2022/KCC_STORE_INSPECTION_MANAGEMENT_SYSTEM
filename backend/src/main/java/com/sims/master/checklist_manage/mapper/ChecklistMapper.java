package com.sims.master.checklist_manage.mapper;

import com.sims.master.checklist_manage.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
     *
     * @return ChecklistResponse 체크리스트 전체 목록 리스트
     */
    public List<ChecklistResponse> selectChecklistAll(ChecklistRequest checklistRequest);

    /**
     * DB에서 체크리스트 삭제
     *
     * @param checklistDeleteRequests 체크리스트 삭제 요청 리스트
     * @return 삭제된 항목의 수
     */
    public int deleteChecklistByChklstId(List<ChecklistDeleteRequest> checklistDeleteRequests);

    /**
     * DB에서 브랜드 이름 전체 조회
     *
     * @return 브랜드 이름 전체 리스트
     */
    public List<String> selectBrandOptions();

    /**
     * DB에서 점검 유형 전체 조회
     *
     * @return 점검 유형 전체 리스트
     */
    public List<String> selectInspTypeOptions();

    /**
     * DB에서 체크리스트 이름 전체 조회
     *
     * @return 체크리스트 이름 전체 리스트
     */
    public List<String> selectChecklistOptions();

    /**
     * 체크리스트 사용 여부 조회
     *
     * @param checklistDeleteRequest
     * @return
     */
    public List<Integer> selectChklstIdByChklstIdAndChklstUseW(List<ChecklistDeleteRequest> checklistDeleteRequest);

    /**
     * 체크리스트 저장 / 수정
     *
     * @param checklistRequests
     * @return 저장 / 수정된 데이터 갯수
     */
    public int insertOrUpdateChecklist(List<ChecklistRequest> checklistRequests);

    /**
     * 체크리스트 중복 체크
     */
    public int selectChklstCount(List<String> chklstNm);

    /**
     * 체크리스트 미리보기
     *
     * @param chklstNm 체크리스트 이름
     * @return 체크리스트 미리보기 데이터
     */
    public List<Map<String, Object>> selectChecklistPreview(String chklstNm);

    /**
     * 체크리스트 사용 여부 수정
     *
     * @return 수정된 데이터 갯수
     * @Param chklstId 체크리스트 Id
     */
    public int updateChklstUseW(int chklstId);


    /**
     * 마스터 체크리스트 ID 조회
     */
//    Long selectMasterChecklistId(String masterChklstNm);

    /**
     * 마스터 체크리스트 대분류 조회
     * @param masterChklstId
     * @return
     */
    public List<Category> selectMasterChklstCtg(Long masterChklstId);

    /**
     * 마스터 체크리스트 중분류 조회
     * @param masterChklstId
     * @return
     */
    public List<Category> selectMasterChklstSubCtg(Long masterChklstId);

    /**
     * 마스터 체크리스트 평가항목 조회
     * @return
     */
    public List<EvaluationItem> selectMasterChklstEvit(Long masterChklstId);

    /**
     * 마스터 체크리스트 선택지 조회
     * @return
     */
    public List<Choice> selectMasterChklstChclst(Long masterChklstId);

    /**
     * 마스터 체크리스트 등록
     * @param masterChklstId
     * @return
     */
    public int updateMasterChklst(String newChklstId, Long masterChklstId);
//
//
//
//    public List<Long> insertCtgCopy(@Param("newChklstId") String newChklstId, @Param("masterChklstId") Long masterChklstId);
//
//    public void insertSubCtgCopy(String newChklstId, Category subCtg);
//
//    public void insertEvitCopy(String newChklstId, EvaluationItem evit);
// 마스터 체크리스트 ID 조회
    Long selectMasterChecklistId(@Param("masterChklstNm") String masterChklstNm);

    // 원본 대분류 ID 리스트 조회
    List<Long> selectMasterCategoryIds(@Param("masterChklstId") Long masterChklstId);

    // 새 체크리스트에 대분류 복사
    int insertCtgCopy(@Param("newChklstId") String newChklstId, @Param("masterChklstId") Long masterChklstId);

    // 새 체크리스트에 중분류 복사
    int insertSubCtgCopy(@Param("newCtgId") Long newCtgId, @Param("masterCtgId") Long masterCtgId);

    // 원본 중분류 ID 리스트 조회
    List<Long> selectSubCategoryIds(@Param("ctgId") Long ctgId);

    // 평가항목 ID 리스트 조회
    List<Long> selectEvaluationItemIds(@Param("subCtgId") Long subCtgId);

    // 새 체크리스트에 평가항목 복사
    int insertEvaluationItemCopy(@Param("newSubCtgId") Long newSubCtgId, @Param("oldSubCtgId") Long oldSubCtgId);

    // 선택지 복사
    int insertChoiceCopy(@Param("newEvitId") Long newEvitId, @Param("oldEvitId") Long oldEvitId);

}


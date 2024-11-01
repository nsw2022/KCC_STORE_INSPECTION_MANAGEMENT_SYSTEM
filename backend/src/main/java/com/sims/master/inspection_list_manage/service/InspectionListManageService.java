package com.sims.master.inspection_list_manage.service;

import com.sims.master.inspection_list_manage.vo.*;

import java.util.List;
/**
 * @Description 점검 항목 관리 서비스 인터페이스
 * @Author 유재원
 * @Date 2024.10.31
 */
public interface InspectionListManageService {
    /**
     * 체크리스트, 마스터 체크리스트 이름 조회
     * @param chklstId
     * @return
     */
    public InspectionPageResponse selectChklstNmByChklstId(String chklstId);

    /**
     * 대분류 조회
     * @param chklstId
     * @return 대분류 리스트
     */
    public List<CtgResponse> selectCtgByChklstId(String chklstId);

    /**
     * 중분류 조회
     * @param chklstId
     * @param CtgNm
     * @return 중분류 리스트
     */
    public List<SubCtgResponse> selectSubCtgByChklstIdAndCtgNm(String chklstId, String CtgNm);

    /**
     * 평가항목 목록 조회
     * @param ctgId
     * @param ctgNm
     * @return 평가항목 목록
     */
    public List<EvitResponse> selectEvitByCtgNmAndCtgId(String ctgId, String ctgNm);

    /**
     * 선택지 목록 조회
     * @param ctgId
     * @param evitNm
     * @return 선택지 목록
     */
    public List<ChclstResponse> selectEvitChclstByCtgIdAndEvitNm(String ctgId, String evitNm);

    /**
     * 대분류 저장 / 수정
     * @param ctgRequest
     * @return 저장 / 수정된 대분류 수
     */
    public int insertOrUpdateCtg(List<CtgRequest> ctgRequest);

    /**
     * 대분류 삭제
     * @param ctgId
     * @return 삭제된 대분류 수
     */
    public int deleteCtg(List<String> ctgId);

    /**
     * 중분류 저장 / 수정
     * @param subCtgRequest
     * @return 저장 / 수정된 중분류 수
     */
    public int insertOrUpdateSubCtg(List<SubCtgRequest> subCtgRequest);

    /**
     * 중분류 삭제
     * @param subCtgId
     * @return 삭제된 중분류 수
     */
    public int deleteSubCtg(List<String> subCtgId);

}

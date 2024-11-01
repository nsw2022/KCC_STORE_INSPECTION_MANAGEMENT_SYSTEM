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
     * 대분류 저장
     * @param ctgRequest
     */
    public int insertOrUpdateCtg(List<CtgRequest> ctgRequest);

}

package com.sims.master.inspection_list_manage.mapper;

import com.sims.master.inspection_list_manage.vo.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * @Description 점검 항목 관리 매퍼 클래스
 * @Author 유재원
 * @Date 2024.10.31
 */

@Mapper
public interface InspectionListManageMapper {

    /**
     * 체크리스트, 마스터 체크리스트 이름 조회
     * @param chklstId
     * @return 체크리스트, 마스터체크리스트 이름
     */
    public InspectionPageResponse selectChklstNmByChklstId(String chklstId);

    /**
     * 대분류 목록 조회
     * @param chklstId
     * @return 대분류 목록
     */
    public List<CtgResponse> selectCtgByChklstId(String chklstId);

    /**
     * 중분류 목록 조회
     * @param chklstId
     * @param ctgNm
     * @return 중분류 목록
     */
    public List<SubCtgResponse> selectSubCtgByChklstIdAndCtgNm(String chklstId, String ctgNm);

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
     * @return 대분류 저장 / 수정 결과
     */
    public int insertOrUpdateCtg(List<CtgRequest> ctgRequest);

    /**
     * 대분류 삭제
     * @param ctgId
     * @return 대분류 삭제 결과
     */
    public int deleteCtg(List<String> ctgId);

    /**
     * 중분류 저장 / 수정
     * @param subCtgRequest
     * @return 중분류 저장 / 수정 결과
     */
    public int insertOrUpdateSubCtg(List<SubCtgRequest> subCtgRequest);

}

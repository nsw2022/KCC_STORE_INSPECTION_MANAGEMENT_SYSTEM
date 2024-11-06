package com.sims.master.store_manage.mapper;

import com.sims.master.store_manage.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @Descrption 가맹점 관리 Mapper
 * @Author 원승언
 * @Date 2024-11-03
 */
@Mapper
public interface StoreMapper {

    /**
     * 가맹점 조회(필터링 포함)
     * @param request
     * @return 가맹점을 검색에 따라 목록 조회
     */
    public List<StoreResponse> selectAllStores(StoreRequest request);

    /**
     *  가맹점명 검색 목록 조회
     * @return 가맹점명 List로 반환
     */
    public List<String> selectAllStoreNms();

    /**
     * 브랜드명 검색 목록 조회
     * @return
     */
    public List<String> selectAllBrandNms();

    /**
     * 점검자와 점검자의 사원번호 목록 조회
     * @return 점검자와 사원번호를 List로 반환
     */
    public List<InspectorNmsResponse> selectAllInspectorNms();

//    public List<String> selectAllBrandNmsByFilter(StoreOptionsRequest storeOptionsRequest);
//
//    public List<String> selectAllStoreNmsByFilter(StoreOptionsRequest storeOptionsRequest);
//
//    public List<InspectorNmsResponse> selectAllInspectorNmsByFilter(StoreOptionsRequest storeOptionsRequest);

    /**
     * SV와 SV의 사원번호 목록 조회
     * @return SV와 사원번호 List로 변환
     */
    public List<SvNmsResponse> selectAllSvNms(InspectorInfoRequest inspectorInfoRequest);

    /**
     * 가맹점 상세 조회
     * @param storeId 가맹점ID
     * @return 가맹점ID에 따라 가맹점 정보를 다르게 보여준다.
     */
    public StoreModalResponse selectStoreByStoreId(int storeId);

    /**
     * 가맹점 삭제
     * @param storeDeleteRequest 가맹점ID LIST
     * @return 가맹점ID를 받아와 해당하는 가맹점 삭제
     */
    public int deleteStoreByStoreId(List<StoreDeleteRequest> storeDeleteRequest);

    /**
     * 가맹점 추가
     * @param storeRequest
     * @return StoreRequest를 파라미터로 받아 Store 추가
     */
    public int storeSave(StoreRequest storeRequest);

    /**
     * 가맹점 수정
     * @param storeRequest
     * @return StoreRequest를 받아 Store 수정
     */
    public int updateStoreByStoreId(StoreRequest storeRequest);

}

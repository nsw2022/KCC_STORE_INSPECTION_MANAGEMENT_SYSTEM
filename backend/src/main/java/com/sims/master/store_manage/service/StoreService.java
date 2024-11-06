package com.sims.master.store_manage.service;

import com.sims.master.store_manage.vo.*;

import java.util.List;

/**
 * @Description 가맹점 관리 Service
 * @Author 원승언
 * @Date 2024-11-03
 */
public interface StoreService {
    /**
     * 가맹점 조회(필터링 포함)
     * @param request
     * @return 검색에 따라 가맹점 목록 다르게 보여주기
     */
    public List<StoreResponse> selectAllStores(StoreRequest request);

    /**
     * 가맹점 검색목록 조회(브랜드명, 가맹점명, 점검자)
     * @return 검색목록을 보여준다.
     */
    public StoreOptionsResponse selectAllStoreOptions();

//    public StoreOptionsResponse selectAllStoreOptionsByFilter(StoreOptionsRequest storeOptionsRequest);

    /**
     * 점검자에 따라 SV 목록 다르게 보여주기
     * @param inspectorInfoRequest 점검자의 사원번호와 이름
     * @return SV 이름과 SV 사원번호 List로 반환
     */
    public List<SvNmsResponse> selectAllSvNms(InspectorInfoRequest inspectorInfoRequest);

    /**
     * 가맹점 상세 조회
     * @param storeId
     * @return 가맹점ID에 따라 해당 가맹점의 정보 조회
     */
    public StoreModalResponse selectStoreByStoreId(int storeId);

    /**
     * 가맹점 삭제
     * @param storeDeleteRequests storeID LIST
     * @return  가맹점 ID 에 따라 가맹점 삭제
     */
    public int deleteStoreByStoreId(List<StoreDeleteRequest> storeDeleteRequests);

    /**
     * 가맹점 추가
     * @param storeRequest
     * @return StoreRequest를 받아 가맹점 추가함
     */
    public int saveStore(StoreRequest storeRequest);

    /**
     * 가맹점 수정
     * @param storeRequest
     * @return StoreRequest를 받아 가맹점 수정
     */
    public int updateStoreByStoreId(StoreRequest storeRequest);
    

}

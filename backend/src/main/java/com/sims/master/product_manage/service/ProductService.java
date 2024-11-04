package com.sims.master.product_manage.service;

import com.sims.master.product_manage.vo.ProductDeleteRequest;
import com.sims.master.product_manage.vo.ProductOptionsResponse;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.product_manage.vo.ProductResponse;

import java.util.List;

/**
 * @Description 점검결과 페이지 Service
 * @Author 원승언
 * @Date 2024-10-30
 */
public interface ProductService {

    /**
     * 제품관리 목록 혹은 검색에 따라 제품 목록을 보여준다
     * @param productRequest
     * @return productRequest를 통해서 List<ProductResponse> 반환
     */
    public List<ProductResponse> selectAllProducts(ProductRequest productRequest);

    /**
     * 제품명 / 브랜드명 / 판매상태가 리스트로 들어가서 ProductOptionsResponse에 담는다.
     * @return 제품명 / 브랜드명 / 판매상태 리스트 반환
     */
    public ProductOptionsResponse selectAllProductOptions();

    /**
     * 제품ID를 통해 해당 제품의 정보를 보여준다.
     * @param pdtId 제품ID
     * @return 제품 정보(ProductResponse) 보여줌
     */
    public ProductResponse selectProductByPdtId(int pdtId);

    /**
     * 제품명, 제품ID, 소비기한, 브랜드명, 가격, 판매상태 등을 입력하여 제품 저장 
     * @param productRequest 
     * @return 제품 insert 
     */
    public int saveProduct(ProductRequest productRequest);

    /**
     * 제품 정보 변경
     * @param productRequest
     * @return 제품 정보 변경
     */
    public int updateProduct(ProductRequest productRequest);

    /**
     * 제품ID 를 통해 제품 삭제
     * @param productRequestLists pdtID LIST
     * @return 제품 삭제
     */
    public int deleteProduct(List<ProductDeleteRequest> productRequestLists);

}

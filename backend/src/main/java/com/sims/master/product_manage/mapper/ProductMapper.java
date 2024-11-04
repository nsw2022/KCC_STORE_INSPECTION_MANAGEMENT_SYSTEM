package com.sims.master.product_manage.mapper;

import com.sims.master.product_manage.vo.ProductDeleteRequest;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.product_manage.vo.ProductResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * @Description 제품 관리 페이지 Mapper
 * @Author 원승언
 * @Date 2024-10-30
 */
@Mapper
public interface ProductMapper {
    /**
     * request를 통해 제품 목록 / 제품 검색을 통한 제품 목록 등을 보여준다.
     * @param request ProductRequest(제품ID, 브랜드코드, 제품명, 제품판매상태 등을 나타내는 객체
     * @return 제품 List를 보여준다
     */
    public List<ProductResponse> selectAllProducts(ProductRequest request);

    /**
     * 제품 테이블의 모든 제품명을 보여준다
     * @return 제품명 LIST
     */
    public List<String> selectAllPdtNm();

    /**
     * 공통 코드 테이블에서 모든 브랜드명을 가져와 보여준다
     * @return 브랜드명 LIST 
     */
    public List<String> selectAllBrandNm();

    /**
     * 공통 코드 테이블에서 제품의 판매 상태를 가져와 보여준다
     * @return 제품판매상태 LIST
     */
    public List<String> selectAllPdtSellSttsNm();

    /**
     * 제품ID를 통해서 제품 정보를 가져온다
     * @param pdtId 제품ID
     * @return 제품ID를 통해 ProductResponse(제품) 정보 보여준다.
     */
    public ProductResponse selectProductByPdtId(@Param("pdtId") int pdtId);

    /**
     * 제품 저장
     * @param request
     * @return product 테이블 저장
     */
    public int saveProduct(ProductRequest request);

    /**
     * 제품 정보 변경
     * @param request
     * @return 제품 정보 변경
     */
    public int updateProduct(ProductRequest request);

    /**
     * 제품ID 를 통해 제품 삭제
     * @param productDeleteRequests pdtID LIST
     * @return 제품 삭제 (return 1)
     */
    public int deleteProductByPdtId(List<ProductDeleteRequest> productDeleteRequests);
}
package com.sims.master.product_manage.service;

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

    public ProductOptionsResponse selectAllProductOptions();

}

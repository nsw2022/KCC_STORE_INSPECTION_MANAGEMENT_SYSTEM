package com.sims.master.product_manage.service;

import com.sims.master.product_manage.mapper.ProductMapper;
import com.sims.master.product_manage.vo.ProductOptionsResponse;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.product_manage.vo.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Description 제품 관리 페이지 Service
 * @Author 원승언
 * @Date 2024-10-30
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{

    private final ProductMapper productMapper;

    @Override
    public List<ProductResponse> selectAllProducts(ProductRequest productRequest) {
        List<ProductResponse> list = productMapper.selectAllProducts(productRequest);
        return list;
    }

    @Override
    public ProductOptionsResponse selectAllProductOptions() {
        ProductOptionsResponse response = ProductOptionsResponse.builder().pdtNmList(productMapper.selectAllPdtNm())
                .brandNmList(productMapper.selectAllBrandNm())
                .pdtSellSttsNmList(productMapper.selectAllPdtSellSttsNm()).build();
        return response;
    }
}
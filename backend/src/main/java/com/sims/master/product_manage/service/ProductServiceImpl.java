package com.sims.master.product_manage.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.config.common.aop.ARoleCheck;
import com.sims.master.product_manage.mapper.ProductMapper;
import com.sims.master.product_manage.vo.ProductDeleteRequest;
import com.sims.master.product_manage.vo.ProductOptionsResponse;
import com.sims.master.product_manage.vo.ProductRequest;
import com.sims.master.product_manage.vo.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
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


    /**
     * Product에서 하나라도 null이 생기면 안되므로 null이면 false를 리턴하는 메서드
     * @param request
     * @return 객체 안에 필드 중 하나라도 null이면 false 리턴
     */
    private boolean validateFieldsNull(ProductRequest request) {
        Field [] fields = request.getClass().getDeclaredFields();
        for(Field field : fields) {
            field.setAccessible(true);
            try {
                if(field.get(request) == null) {
                    return true;
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return false;
    }

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

    @Override
    public ProductResponse selectProductByPdtId(int pdtId) {
        return productMapper.selectProductByPdtId(pdtId);
    }

    @ARoleCheck
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int saveProduct(ProductRequest productRequest) {
        if(validateFieldsNull(productRequest)) {
            throw new CustomException(ErrorCode.INVALID_PARAMETER);
        }
        int result = productMapper.saveProduct(productRequest);
        if(result < 1) {
            throw new CustomException(ErrorCode.SAVE_FAIL);
        } else {
            return result;
        }
    }

    @ARoleCheck
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int updateProduct(ProductRequest productRequest) {
        int result = productMapper.updateProduct(productRequest);
        if(result < 1) {
            throw new CustomException(ErrorCode.SAVE_FAIL);
        } else {
            return result;
        }
    }

    @ARoleCheck
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int deleteProduct(List<ProductDeleteRequest> productDeleteRequests) {
        int result = productMapper.deleteProductByPdtId(productDeleteRequests);
        if(result < 1) {
            throw new CustomException(ErrorCode.SAVE_FAIL);
        } else {
            return result;
        }
    }


}
package com.sims.master.product_manage.mapper;

import com.sims.master.product_manage.vo.ProductRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class ProductMapperTest {

    @Autowired
    private ProductMapper productMapper;

    @Test
    public void test() {
        ProductRequest request = ProductRequest.builder().pdtNm("추억의 맘모스").build();
        log.info("result = {}", productMapper.selectAllProducts(request));
        Assertions.assertNotNull(productMapper.selectAllProducts(request));
    }
}
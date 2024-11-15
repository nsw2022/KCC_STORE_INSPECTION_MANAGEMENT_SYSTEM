package com.sims.master.product_manage.service;

import com.sims.master.product_manage.vo.ProductRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class ProductServiceImplTest {
    @Autowired
    private ProductService productService;

    @Test
    public void test() {
        ProductRequest request = ProductRequest.builder().pdtNm("부드러운 크라상").brandNm("KCC 크라상").pdtPrice(4000).pdtSellSttsNm("판매중")
                .expDaynum(7).mbrNo("A202410001").build();
        log.info("result = {}", productService.saveProduct(request));
        Assertions.assertNotNull(productService.saveProduct(request));
    }
}
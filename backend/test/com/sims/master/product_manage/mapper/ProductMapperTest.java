package com.sims.master.product_manage.mapper;

import com.sims.master.product_manage.vo.ProductRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Slf4j
class ProductMapperTest {

    @Autowired
    private ProductMapper productMapper;

    @Transactional
    @Test
    public void test() {
        ProductRequest request = ProductRequest.builder().pdtNm("감자샌드위치").brandNm("KCC 크라상").pdtPrice(4000).mbrNo("A202410001")
                .expDaynum(7).pdtSellSttsNm("판매중").build();
        log.info("result = {}", productMapper.saveProduct(request));
        Assertions.assertNotNull(productMapper.saveProduct(request));
    }
}

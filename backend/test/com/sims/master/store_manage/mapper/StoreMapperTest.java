package com.sims.master.store_manage.mapper;

import com.sims.master.store_manage.vo.InspectorInfoRequest;
import com.sims.master.store_manage.vo.InspectorNmsResponse;
import com.sims.master.store_manage.vo.StoreRequest;
import com.sims.master.store_manage.vo.StoreResponse;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class StoreMapperTest {

    @Autowired
    private StoreMapper storeMapper;

    @Test
    public void test() {
        InspectorInfoRequest request = InspectorInfoRequest.builder().inspMbrNo("C202410002").inspMbrNm("유재원").build();
        log.info("result = {}", storeMapper.selectAllSvNms(request));
        Assertions.assertNotNull(storeMapper.selectAllSvNms(request));
    }

}
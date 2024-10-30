package com.sims.qsc.inspection_result.mapper;

import com.sims.qsc.inspection_result.vo.InspectionResultRequest;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
class InspectionResultMapperTest {
    @Autowired
    private InspectionResultMapper inspectionResultMapper;

    @Test
    public void test() {
        InspectionResultRequest request = InspectionResultRequest.builder().brandCd("B001").build();
        log.info("result = {}", inspectionResultMapper.selectInspectionResultBySearch(request, "C202410004"));
        Assertions.assertNotNull(inspectionResultMapper.selectInspectionResultBySearch(request, "C202410004"));
    }
}
package com.sims.qsc.inspection_result.mapper;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
class InspectionResultPopupMapperTest {
    @Autowired
    private InspectionResultPopupMapper inspectionResultPopupMapper;

    @Test
    public void test() {
        int id = 1;
        String name = "중대법규";
        String sub = "과태료";
        log.info("result = {}",inspectionResultPopupMapper.selectInspResultEvaluationByCategoryNms(id, name, sub));
        Assertions.assertNotNull(inspectionResultPopupMapper.selectInspResultEvaluationByCategoryNms(id, name, sub));
    }
}
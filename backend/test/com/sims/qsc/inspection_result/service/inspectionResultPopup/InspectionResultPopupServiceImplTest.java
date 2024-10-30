package com.sims.qsc.inspection_result.service.inspectionResultPopup;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Slf4j
class InspectionResultPopupServiceImplTest {
    @Autowired
    private InspectionResultPopupServiceImpl inspectionResultPopupService;

    @Test
    public void test() {
        log.info("result = {}", inspectionResultPopupService.selectInspectionResultCategoryDetailByInspResultId(3));
        Assertions.assertNotNull(inspectionResultPopupService.selectInspectionResultCategoryDetailByInspResultId(3));
    }
}
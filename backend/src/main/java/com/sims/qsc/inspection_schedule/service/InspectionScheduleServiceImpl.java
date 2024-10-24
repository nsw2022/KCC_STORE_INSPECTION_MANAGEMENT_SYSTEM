package com.sims.qsc.inspection_schedule.service;

import com.sims.qsc.inspection_schedule.mapper.InspectionScheduleMapper;
import com.sims.qsc.inspection_schedule.vo.InspectionDetailsResponse;
import com.sims.qsc.inspection_schedule.vo.InspectionScheduleRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionScheduleServiceImpl implements InspectionScheduleService {

    private final InspectionScheduleMapper scheduleMapper;

    public List<InspectionScheduleRequest> selectFilteredInspectionScheduleList(
            String storeNm, String brandNm, String scheduleDate, String chklstNm, String inspector, String frqCd,  String cntCd) {
        log.info("storeNm {}", storeNm);
        log.info("brandNm {}", brandNm);
        log.info("scheduleDate {}", scheduleDate);
        log.info("chklstNm {}", chklstNm);
        log.info("inspector {}", inspector);
        log.info("cntCd {}", cntCd);
        log.info("frqCd {}", frqCd);

        return scheduleMapper.selectFilteredInspectionScheduleList(
                storeNm, brandNm, scheduleDate, chklstNm, inspector, frqCd, cntCd
        );
    }

    @Override
    public List<String> selectAllStores() {
        return scheduleMapper.selectAllStores();
    }

    @Override
    public List<String> selectAllBrands() {
        return scheduleMapper.selectAllBrands();
    }

    @Override
    public List<String> selectAllChecklists() {
        return scheduleMapper.selectAllChecklists();
    }

    @Override
    public List<String> selectAllInspectors() {
        return scheduleMapper.selectAllInspectors();
    }

    @Override
    public List<InspectionDetailsResponse> selectInspectionDetails(Integer storeId) {
        return scheduleMapper.selectInspectionDetails(storeId);
    }

}

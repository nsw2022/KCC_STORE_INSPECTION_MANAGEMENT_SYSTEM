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



    /**
     *
     * @param storeNm 가맹점
     * @param brandNm 브랜드
     * @param scheduleDate 점검예정일
     * @param chklstNm 체크리스트명
     * @param inspector 점검자
     * @param frqCd 빈도
     * @param cntCd 횟수
     * @return 필터 요소가 적용된 점검일정 목록
     */
    public List<InspectionScheduleRequest> getFilteredInspectionScheduleList(
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

    /**
     *
     * @param storeId 가맹점 번호 - 시퀀스
     * @return 가맹점별 체크 리스트, 체크리스트 문항과 점수
     */
    @Override
    public List<InspectionDetailsResponse> getInspectionDetails(Integer storeId) {
        return scheduleMapper.selectInspectionDetails(storeId);
    }

}

package com.sims.qsc.inspection_schedule.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.config.common.aop.SVInspectorRolCheck;
import com.sims.master.checklist_manage.mapper.ChecklistMapper;
import com.sims.qsc.inspection_schedule.mapper.InspectionScheduleMapper;
import com.sims.qsc.inspection_schedule.vo.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class InspectionScheduleServiceImpl implements InspectionScheduleService {

    private final InspectionScheduleMapper scheduleMapper;

    private final ChecklistMapper checklistMapper;

    @Override
    public List<InspectionScheduleRequest> selectFilteredInspectionScheduleList(
            String storeNm, String brandNm, String scheduleDate, String chklstNm, String inspector, String frqCd, String cntCd, String currentMbrNo) {
        return scheduleMapper.selectFilteredInspectionScheduleList(
                storeNm, brandNm, scheduleDate, chklstNm, inspector, frqCd, cntCd, currentMbrNo
        );
    }

    @Override
    public List<Map<String, Object>> selectAllStores(String currentMbrNo) {
        return scheduleMapper.selectAllStores(currentMbrNo);
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
    public List<Map<String, Object>> selectBottomChkLst() {
        return scheduleMapper.selectBottomChkLst();
    }

    @Override
    public List<String> selectBottomINSP() {
        return scheduleMapper.selectBottomINSP();
    }

    @Override
    public List<InspectionDetailsResponse> selectInspectionDetails(Integer storeId) {
        return scheduleMapper.selectInspectionDetails(storeId);
    }



    @Override
    public MemberRequest selectMbrDetail(String creMbrNo) {
        log.info("creMbrNo {}",creMbrNo);
        return scheduleMapper.selectMbrDetail(creMbrNo);
    }

    @Override
    public InspectionPlan selectInspPlanById(int inspPlanId) {
        return scheduleMapper.selectInspPlanById(inspPlanId);
    }

    @Override
    public Integer getMaxInspSchdId() {
        Integer a = scheduleMapper.getMaxInspSchdId();

        return a;
    }

    @Override
    @Transactional
    @SVInspectorRolCheck
    public void updateInspectionPlans(InspectionPlan inspectionPlan) {
        scheduleMapper.updateInspectionPlans(inspectionPlan);
        log.info("Updated InspectionPlan with ID: {}", inspectionPlan.getInspPlanId());
    }

    @Override
    @Transactional
    @SVInspectorRolCheck
    public void insertInspectionPlans(InspectionPlan inspectionPlan) {

        // 생성 시간 설정
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        inspectionPlan.setCreTm(currentTime);
        // 상태 코드 설정 (예: '1'로 고정)
        inspectionPlan.setInspPlanSttsW("1");
        // 삽입
        scheduleMapper.insertInspectionPlans(inspectionPlan);
        log.info("Inserted new InspectionPlan with ID: {}", inspectionPlan.getInspPlanId());
    }

    @Override
    @Transactional
    @SVInspectorRolCheck
    public void updateInspectionSchedules(InspectionSchedule inspectionSchedule) {
        scheduleMapper.updateInspectionSchedules(inspectionSchedule);
        log.info("Updated InspectionSchedule with ID: {}", inspectionSchedule.getInspSchdId());
    }

    @Override
    @Transactional
    @SVInspectorRolCheck
    public void insertInspectionSchedules(List<InspectionSchedule> schedules) {

        log.info("오긴함?");
        if (!schedules.isEmpty()) {

            scheduleMapper.insertInspectionSchedules(schedules);

            log.info("Inserted {} new InspectionSchedules.", schedules.size());
        }
    }




    @Override
    @Transactional
    @SVInspectorRolCheck
    public InspectionSchedule selectInspectionSchedulesByPlanIdAndDate(int inspPlanId, int inspSchdId) {
        return scheduleMapper.selectInspectionSchedulesByPlanIdAndDate(inspPlanId, inspSchdId);
    }

    @Override
    @Transactional
    @SVInspectorRolCheck
    public void insertOrUpdateInspectionPlans(List<InspectionPlan> inspectionPlans) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String creMbrNo = auth.getName();  // 로그인 한 사람
        log.info("Authenticated user name: {}", creMbrNo);
        log.info("Received inspection plans: {}", inspectionPlans);
        if(inspectionPlans.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }


        // 1. 점검 계획 저장/수정
        saveInspectionPlans(inspectionPlans, creMbrNo);

        // 2. 점검 일정 생성 준비
        List<InspectionSchedule> schedulesToInsert = new ArrayList<>();
        List<InspectionSchedule> schedulesToUpdate = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusMonths(3);

        for (InspectionPlan plan : inspectionPlans) {
            // 점검 계획이 활성화되지 않은 경우 일정 생성하지 않음
            if (!"Y".equals(plan.getInspPlanUseW())) {
                log.info("InspectionPlan ID: {} is not active. Skipping schedule generation.", plan.getInspPlanId());
                continue;
            }

            // 점검 일정 날짜 생성 (3개월치)
            List<LocalDate> inspectionDates = generateInspectionDates(plan, today, endDate);
            log.info("Generated {} inspection dates for InspectionPlan ID: {}", inspectionDates.size(), plan.getInspPlanId());
            log.info("Generated {} inspectionDates",inspectionDates);
            for (LocalDate date : inspectionDates) {
                // 주말 제외
                if (isWeekend(date)) {
                    log.info("Date: {} is weekend. Skipping.", date);
                    continue;
                }


                log.info("Processing schedule for InspectionPlan ID: {}, InspSchdId ID: {}", plan.getInspPlanId(), plan.getInspSchdId());

                // 점검 일정 상세 조회 (inspPlanId와 inspPlanDt 기준) -> 여길수정해야해 방법이안떠오름 insp_schd_id 를 어캐가져오지
                // 1안 -> insp_plan_id로 insp_schd 테이블에 조회때려보기
                InspectionSchedule existingSchedule = selectDetailSchedule(plan.getInspPlanId(), plan.getInspSchdId());

                log.info("existing schedule type : {}", existingSchedule);

                // 임시객체 mbr
                MemberRequest mbrRequest = scheduleMapper.selectMbrDetail(creMbrNo);
                log.info("Member Request: {}", mbrRequest);

                if (mbrRequest == null) {
                    log.error("MemberRequest is null for creMbrNo: {}", creMbrNo);
                    throw new RuntimeException("Invalid member ID: " + creMbrNo);
                }
                log.info("find existingSchedule{}",existingSchedule );

                if (existingSchedule == null) { // 새로운 일정이면 삽입
                    InspectionSchedule newSchedule = new InspectionSchedule();
                    //newSchedule.setInspSchdId(scheduleMapper.getMaxInspSchdId());
                    newSchedule.setInspPlanId(plan.getInspPlanId());
                    newSchedule.setStoreId(plan.getStoreId());
                    newSchedule.setInspPlanDt(date.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
                    newSchedule.setInspSttsCd("IS001");
                    newSchedule.setCreMbrId(mbrRequest.getMbrId());
                    newSchedule.setCreTm(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm")));
                    newSchedule.setInspSchdSttsW("1");
                    log.info("After insp_schd setting insert {}",newSchedule);
                    schedulesToInsert.add(newSchedule);
                    log.info("Prepared new InspectionSchedule for insertion: {}", newSchedule);
                } else { // 기존 일정이면 업데이트
                    existingSchedule.setStoreId(plan.getStoreId());
                    existingSchedule.setInspSttsCd("IS001");
                    existingSchedule.setUpdMbrId(mbrRequest.getMbrId());
                    existingSchedule.setInspPlanDt(date.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
                    existingSchedule.setInspSchdSttsW("1");
                    existingSchedule.setUpdTm(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm")));
                    log.info("After insp_schd setting update {} ",existingSchedule);
                    schedulesToUpdate.add(existingSchedule);
                    log.info("Prepared existing InspectionSchedule for update: {}", existingSchedule);
                }
            }
        }

        // 3. 점검 일정 삽입 (배치)
        if (!schedulesToInsert.isEmpty()) {
            scheduleMapper.insertInspectionSchedules(schedulesToInsert);
            log.info("Inserted {} new InspectionSchedules.", schedulesToInsert.size());
        }

        // 4. 점검 일정 업데이트
        if (!schedulesToUpdate.isEmpty()) {
            for (InspectionSchedule schedule : schedulesToUpdate) {
                updateInspectionSchedules(schedule);
            }
            log.info("Updated {} existing InspectionSchedules.", schedulesToUpdate.size());
            log.info("Updated {} Existing scan schedule objects", schedulesToUpdate);
        }

        log.info("Total InspectionSchedules to insert: {}", schedulesToInsert.size());
        log.info("Total InspectionSchedules to update: {}", schedulesToUpdate.size());
    }

    /**
     * 특정 inspPlanId와 inspPlanDt에 해당하는 점검 일정을 조회하는 메서드
     *
     * @param inspPlanId  점검 계획 ID
     * @param inspSchdId  점검 일정 ID
     * @return 점검 일정 객체 또는 null
     */
    public InspectionSchedule selectDetailSchedule(int inspPlanId, int inspSchdId) {
        InspectionSchedule schedules = null;
        log.info("selectDetailSchedule called@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        if (inspSchdId != 0){
            log.info("selectDetailSchedule inspSchdId{} ",inspSchdId);
            schedules = scheduleMapper.selectInspectionSchedulesByPlanIdAndDate(
                    inspPlanId, inspSchdId
            );

            if (schedules == null) {
                log.warn("No InspectionSchedule found for inspPlanId: {} and inspPlanDt: {}", inspPlanId, inspSchdId);
                return null;
            } else  {
                log.warn("Found for inspPlanId: {} and inspPlanDt: {}", inspPlanId, inspSchdId);
            }
            log.info("schedules : {}",schedules);
        }

        return schedules;
    }

    /**
     * 점검 계획 목록을 저장 또는 수정하는 메서드
     *
     * @param inspectionPlans 저장할 점검 계획 목록
     * @param currentMemberId 현재 로그인한 회원 ID
     */
    @Transactional
    public void saveInspectionPlans(List<InspectionPlan> inspectionPlans, String currentMemberId) {
        // 생성 시간 설정
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        MemberRequest memberRequest = scheduleMapper.selectMbrDetail(currentMemberId);
        log.info(" saveInspectionPlans memberRequest  {}",memberRequest);
        for (InspectionPlan plan : inspectionPlans) {
            if (plan.getInspPlanId() == null ) {

                if(plan.getFrqCd().equals("NF")) plan.setCntCd(null);

                // 새로운 점검 계획
                plan.setCreTm(currentTime);
                plan.setCreMbrId(memberRequest.getMbrId());
                // 상태 코드 설정 (예: '1'로 고정)
                plan.setInspPlanSttsW("1");
                log.info("After setting, insertPlan: {}", plan);
                scheduleMapper.insertInspectionPlans(plan);
                log.info("Inserted new InspectionPlan with ID: {}", plan.getInspPlanId());
            } else {

                if(plan.getFrqCd().equals("NF")) plan.setCntCd(null);

                InspectionPlan inspectionPlan=selectInspPlanById(plan.getInspPlanId());


                // 기존 점검 계획 업데이트
                plan.setCreTm(inspectionPlan.getCreTm());
                plan.setCreMbrId(inspectionPlan.getCreMbrId());
                plan.setUpdTm(currentTime);
                plan.setUpdMbrId(memberRequest.getMbrId());
                log.info("After setting, update Plan{}",plan);
                scheduleMapper.updateInspectionPlans(plan);
                log.info("Updated InspectionPlan with ID: {}", plan.getInspPlanId());
            }
        }
        log.info("inspectionPlans {}", inspectionPlans);

        log.info("Saved {} InspectionPlans.", inspectionPlans.size());
    }

    /**
     * 점검 계획에 따라 점검 일정 날짜를 생성하는 메서드
     *
     * @param plan  점검 계획 객체
     * @param start 시작 날짜
     * @param end   종료 날짜 (3개월 후)
     * @return 생성된 점검 일정 날짜 목록
     */
    private List<LocalDate> generateInspectionDates(InspectionPlan plan, LocalDate start, LocalDate end) {
        List<LocalDate> dates = new ArrayList<>();
        String frqCd = plan.getFrqCd();
        String cntCd = plan.getCntCd();

        switch (frqCd) {
            case "ED": // 일별
                int dailyInterval = parseInterval(cntCd, "D");
                for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(dailyInterval)) {
                    dates.add(date);
                }
                break;

            case "EW": // 주별
                int weeklyInterval = parseInterval(cntCd, "W");
                DayOfWeek targetDay = getDayOfWeekFromWeek(plan.getWeek());
                LocalDate firstWeekDate = start.with(TemporalAdjusters.nextOrSame(targetDay));
                for (LocalDate date = firstWeekDate; !date.isAfter(end); date = date.plusWeeks(weeklyInterval)) {
                    dates.add(date);
                }
                break;

            case "EM": // 월별
                int monthlyInterval = parseInterval(cntCd, "M");
                int dayOfMonth = plan.getSlctDt() != null && !plan.getSlctDt().isEmpty() ? Integer.parseInt(plan.getSlctDt()) : 1;
                for (LocalDate date = start.withDayOfMonth(Math.min(dayOfMonth, start.lengthOfMonth()));
                     !date.isAfter(end);
                     date = date.plusMonths(monthlyInterval).withDayOfMonth(Math.min(dayOfMonth, date.plusMonths(monthlyInterval).lengthOfMonth()))) {
                    dates.add(date);
                }
                break;

            case "NF": // 빈도없음
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
                    dates.add(LocalDate.parse(plan.getInspPlanDt(), formatter));
                } catch (DateTimeParseException e) {
                    log.error("Invalid date format for NF case: {}. Expected format: yyyyMMdd", plan.getInspPlanDt());
                    throw e; // or handle it accordingly
                }
                break;

            default:
                log.warn("Unknown FRQ_CD: {}", frqCd);
        }

        return dates;
    }

    /**
     * CNT_CD에서 인터벌 값을 추출하는 메서드
     *
     * @param cntCd    CNT_CD 값
     * @param prefixCd CNT_CD의 접두사 (D, W, M 등)
     * @return 인터벌 값
     */
    private int parseInterval(String cntCd, String prefixCd) {
        if (cntCd == null || !cntCd.startsWith(prefixCd)) {
            return 1; // 기본 인터벌은 1
        }
        try {
            return Integer.parseInt(cntCd.substring(1));
        } catch (NumberFormatException e) {
            log.warn("Failed to parse CNT_CD: {}. Using default interval 1.", cntCd);
            return 1;
        }
    }

    /**
     * 주어진 주 코드에서 DayOfWeek를 반환하는 메서드
     *
     * @param week 주 코드 (예: MON, TUE, ...)
     * @return DayOfWeek 열거형
     */
    private DayOfWeek getDayOfWeekFromWeek(String week) {
        if (week == null || week.isEmpty()) {
            return DayOfWeek.MONDAY; // 기본값
        }
        switch (week.toUpperCase()) {
            case "MON":
            case "MO":
                return DayOfWeek.MONDAY;
            case "TUE":
            case "TU":
                return DayOfWeek.TUESDAY;
            case "WED":
            case "WE":
                return DayOfWeek.WEDNESDAY;
            case "THU":
            case "TH":
                return DayOfWeek.THURSDAY;
            case "FRI":
            case "FR":
                return DayOfWeek.FRIDAY;
            case "SAT":
            case "SA":
                return DayOfWeek.SATURDAY;
            case "SUN":
            case "SU":
                return DayOfWeek.SUNDAY;
            default:
                log.warn("Unknown week code: {}. Defaulting to MONDAY.", week);
                return DayOfWeek.MONDAY; // 기본값
        }
    }

    /**
     * 주어진 날짜가 주말인지 확인하는 메서드
     *
     * @param date 확인할 날짜
     * @return 주말 여부
     */
    private boolean isWeekend(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }
}

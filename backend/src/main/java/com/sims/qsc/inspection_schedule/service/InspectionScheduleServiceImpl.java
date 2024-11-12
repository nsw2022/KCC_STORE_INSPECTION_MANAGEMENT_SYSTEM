package com.sims.qsc.inspection_schedule.service;

import com.sims.config.Exception.CustomException;
import com.sims.config.Exception.ErrorCode;
import com.sims.config.common.aop.SRoleCheck;
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

    // DateTimeFormatter를 상수로 정의하여 중복 제거
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmm");

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
        log.info("Fetching Member Detail for creMbrNo: {}", creMbrNo);
        return scheduleMapper.selectMbrDetail(creMbrNo);
    }

    @Override
    public InspectionPlan selectInspPlanById(int inspPlanId) {
        return scheduleMapper.selectInspPlanById(inspPlanId);
    }

    @Override
    public Integer getMaxInspSchdId() {
        return scheduleMapper.getMaxInspSchdId();
    }

    @Override
    public void deleteInspectionSchedulesByPlanId(int inspPlanId) {
        log.info("Deleting all InspectionSchedules for InspectionPlan ID: {}", inspPlanId);
        scheduleMapper.deleteInspectionSchedulesByPlanId(inspPlanId);
        log.info("Deleted all InspectionSchedules for InspectionPlan ID: {}", inspPlanId);
    }

    @Override
    @Transactional
    @SRoleCheck
    public void updateInspectionPlans(InspectionPlan inspectionPlan) {
        scheduleMapper.updateInspectionPlans(inspectionPlan);
        log.info("Updated InspectionPlan with ID: {}", inspectionPlan.getInspPlanId());
    }

    @Override
    @Transactional
    @SRoleCheck
    public void insertInspectionPlans(InspectionPlan inspectionPlan) {
        inspectionPlan.setCreTm(getCurrentTime());
        inspectionPlan.setInspPlanSttsW("1");
        scheduleMapper.insertInspectionPlans(inspectionPlan);
        log.info("Inserted new InspectionPlan with ID: {}", inspectionPlan.getInspPlanId());
    }

    @Override
    @Transactional
    @SRoleCheck
    public void updateInspectionSchedules(InspectionSchedule inspectionSchedule) {
        scheduleMapper.updateInspectionSchedules(inspectionSchedule);
        log.info("Updated InspectionSchedule with ID: {}", inspectionSchedule.getInspSchdId());
    }

    @Override
    @Transactional
    @SRoleCheck
    public void insertInspectionSchedules(List<InspectionSchedule> schedules) {
        if (!schedules.isEmpty()) {
            scheduleMapper.insertInspectionSchedules(schedules);
            log.info("Inserted {} new InspectionSchedules.", schedules.size());
        } else {
            log.warn("No InspectionSchedules to insert.");
        }
    }

    @Override
    @Transactional
    @SRoleCheck
    public List<InspectionSchedule> selectInspectionSchedulesByPlanIdAndDate(int inspPlanId) {
        return scheduleMapper.selectInspectionSchedulesByPlanIdAndDate(inspPlanId);
    }

    @Override
    @Transactional
    @SRoleCheck
    public void insertOrUpdateInspectionPlans(List<InspectionPlan> inspectionPlans) {
        String creMbrNo = getAuthenticatedUserName();
        log.info("Authenticated user name: {}", creMbrNo);
        log.info("Received inspection plans: {}", inspectionPlans);

        if (inspectionPlans.isEmpty()) {
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }

        // 1. 점검 계획 저장/수정
        saveInspectionPlans(inspectionPlans, creMbrNo);

        // 2. 점검 일정 생성 준비
        List<InspectionSchedule> schedulesToInsert = new ArrayList<>();
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusMonths(3);

        for (InspectionPlan plan : inspectionPlans) {
            if (!"Y".equals(plan.getInspPlanUseW())) {
                log.info("InspectionPlan ID: {} is not active. Skipping schedule generation.", plan.getInspPlanId());
                continue;
            }

            List<LocalDate> inspectionDates = generateInspectionDates(plan, today, endDate);
            log.info("Generated {} inspection dates for InspectionPlan ID: {}", inspectionDates.size(), plan.getInspPlanId());

            for (LocalDate date : inspectionDates) {
                if (isWeekend(date)) {
                    log.info("Date: {} is weekend. Skipping.", date);
                    continue;
                }

                List<InspectionSchedule> existingSchedules = selectDetailSchedules(plan.getInspPlanId());

                MemberRequest mbrRequest = getMemberRequest(creMbrNo);

                if (existingSchedules.isEmpty()) {
                    log.info("start new Schedule {}", plan);
                    InspectionSchedule newSchedule = createNewInspectionSchedule(plan, date, mbrRequest);
                    schedulesToInsert.add(newSchedule);
                } else {
                    log.info("start update Schedule {}", plan);
                    deleteInspectionSchedulesByPlanId(plan.getInspPlanId());
                    InspectionSchedule newSchedule = createNewInspectionSchedule(plan, date, mbrRequest, true);
                    schedulesToInsert.add(newSchedule);
                }
            }
        }

        // 3. 점검 일정 삽입 (배치)
        if (!schedulesToInsert.isEmpty()) {
            scheduleMapper.insertInspectionSchedules(schedulesToInsert);
            log.info("Inserted {} new InspectionSchedules.", schedulesToInsert.size());
        } else {
            log.info("No new InspectionSchedules to insert.");
        }

        log.info("Total InspectionSchedules to insert: {}", schedulesToInsert.size());
    }

    /**
     * 현재 시간을 포맷팅하여 반환하는 메서드
     *
     * @return 현재 시간 문자열
     */
    private String getCurrentTime() {
        return LocalDateTime.now().format(DATE_TIME_FORMATTER);
    }

    /**
     * 인증된 사용자 이름을 반환하는 메서드
     *
     * @return 인증된 사용자 이름
     */
    private String getAuthenticatedUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /**
     * MemberRequest를 반환하는 메서드
     *
     * @param creMbrNo 생성자 회원 번호
     * @return MemberRequest 객체
     */
    private MemberRequest getMemberRequest(String creMbrNo) {
        MemberRequest mbrRequest = scheduleMapper.selectMbrDetail(creMbrNo);
        if (mbrRequest == null) {
            log.error("MemberRequest is null for creMbrNo: {}", creMbrNo);
            throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
        }
        return mbrRequest;
    }

    /**
     * 새로운 InspectionSchedule을 생성하는 메서드
     *
     * @param plan       InspectionPlan 객체
     * @param date       점검 날짜
     * @param mbrRequest MemberRequest 객체
     * @return 새로운 InspectionSchedule 객체
     */
    private InspectionSchedule createNewInspectionSchedule(InspectionPlan plan, LocalDate date, MemberRequest mbrRequest) {
        return createNewInspectionSchedule(plan, date, mbrRequest, false);
    }

    /**
     * 새로운 InspectionSchedule을 생성하는 메서드
     *
     * @param plan       InspectionPlan 객체
     * @param date       점검 날짜
     * @param mbrRequest MemberRequest 객체
     * @param isUpdate   업데이트 여부
     * @return 새로운 InspectionSchedule 객체
     */
    private InspectionSchedule createNewInspectionSchedule(InspectionPlan plan, LocalDate date, MemberRequest mbrRequest, boolean isUpdate) {
        InspectionSchedule newSchedule = new InspectionSchedule();
        newSchedule.setInspPlanId(plan.getInspPlanId());
        newSchedule.setStoreId(plan.getStoreId());
        newSchedule.setInspPlanDt(date.format(DATE_FORMATTER));
        newSchedule.setInspSttsCd("IS001");
        newSchedule.setCreMbrId(mbrRequest.getMbrId());
        newSchedule.setInspSchdSttsW("1");
        newSchedule.setCreTm(getCurrentTime());

        if (isUpdate) {
            newSchedule.setUpdTm(getCurrentTime());
        }

        log.debug("Prepared InspectionSchedule for insertion: {}", newSchedule);
        return newSchedule;
    }

    /**
     * 특정 inspPlanId에 해당하는 점검 일정을 조회하는 메서드
     *
     * @param inspPlanId 점검 계획 ID
     * @return 점검 일정 리스트
     */
    private List<InspectionSchedule> selectDetailSchedules(int inspPlanId) {
        log.info("selectDetailSchedules called for inspPlanId: {}", inspPlanId);
        try {
            List<InspectionSchedule> schedules = scheduleMapper.selectInspectionSchedulesByPlanIdAndDate(inspPlanId);
            if (schedules == null || schedules.isEmpty()) {
                log.warn("No InspectionSchedules found for inspPlanId: {}", inspPlanId);
            } else {
                log.info("Found {} InspectionSchedules for inspPlanId: {}", schedules.size(), inspPlanId);
            }
            return schedules;
        } catch (Exception e) {
            log.error("Error while selecting InspectionSchedules for inspPlanId: {}", inspPlanId, e);
            throw new CustomException(ErrorCode.SAVE_FAIL);
        }
    }

    /**
     * 점검 계획 목록을 저장 또는 수정하는 메서드
     *
     * @param inspectionPlans 저장할 점검 계획 목록
     * @param currentMemberId 현재 로그인한 회원 ID
     */
    @Transactional
    protected void saveInspectionPlans(List<InspectionPlan> inspectionPlans, String currentMemberId) {
        String currentTime = LocalDateTime.now().format(DATE_TIME_FORMATTER);
        MemberRequest memberRequest = getMemberRequest(currentMemberId);
        log.info("Saving InspectionPlans by member: {}", memberRequest);

        for (InspectionPlan plan : inspectionPlans) {
            if (plan.getInspPlanId() == null) {
                prepareAndInsertNewInspectionPlan(plan, currentTime, memberRequest);
            } else {
                prepareAndUpdateExistingInspectionPlan(plan, currentTime, memberRequest);
            }
        }

        log.info("Saved {} InspectionPlans.", inspectionPlans.size());
    }

    /**
     * 새로운 InspectionPlan을 준비하고 삽입하는 메서드
     *
     * @param plan          InspectionPlan 객체
     * @param currentTime   현재 시간 문자열
     * @param memberRequest MemberRequest 객체
     */
    private void prepareAndInsertNewInspectionPlan(InspectionPlan plan, String currentTime, MemberRequest memberRequest) {
        if ("NF".equals(plan.getFrqCd())) {
            plan.setCntCd(null);
        }

        plan.setCreTm(currentTime);
        plan.setCreMbrId(memberRequest.getMbrId());
        plan.setInspPlanSttsW("1");
        log.debug("Inserting new InspectionPlan: {}", plan);
        scheduleMapper.insertInspectionPlans(plan);
        log.info("Inserted new InspectionPlan with ID: {}", plan.getInspPlanId());
    }

    /**
     * 기존 InspectionPlan을 업데이트하는 메서드
     *
     * @param plan          InspectionPlan 객체
     * @param currentTime   현재 시간 문자열
     * @param memberRequest MemberRequest 객체
     */
    private void prepareAndUpdateExistingInspectionPlan(InspectionPlan plan, String currentTime, MemberRequest memberRequest) {
        if ("NF".equals(plan.getFrqCd())) {
            plan.setCntCd(null);
        }

        InspectionPlan existingPlan = selectInspPlanById(plan.getInspPlanId());
        plan.setCreTm(existingPlan.getCreTm());
        plan.setCreMbrId(existingPlan.getCreMbrId());
        plan.setUpdTm(currentTime);
        plan.setUpdMbrId(memberRequest.getMbrId());
        log.debug("Updating InspectionPlan: {}", plan);
        scheduleMapper.updateInspectionPlans(plan);
        log.info("Updated InspectionPlan with ID: {}", plan.getInspPlanId());
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
                if ("LD".equalsIgnoreCase(cntCd)) {
                    // 월의 마지막 날 처리
                    for (LocalDate date = start.with(TemporalAdjusters.lastDayOfMonth());
                         !date.isAfter(end);
                         date = date.plusMonths(1).with(TemporalAdjusters.lastDayOfMonth())) {
                        dates.add(date);
                    }
                } else {

                    for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(dailyInterval)) {
                        dates.add(date);
                    }
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
                if ("LD".equalsIgnoreCase(cntCd)) {
                    // 월의 마지막 날 처리
                    for (LocalDate date = start.with(TemporalAdjusters.lastDayOfMonth());
                         !date.isAfter(end);
                         date = date.plusMonths(1).with(TemporalAdjusters.lastDayOfMonth())) {
                        dates.add(date);
                    }
                } else {
                    // 일반적인 월별 간격 처리
                    int monthlyInterval = parseInterval(cntCd, "M");
                    int dayOfMonth = (plan.getSlctDt() != null && !plan.getSlctDt().isEmpty()) ? Integer.parseInt(plan.getSlctDt()) : 1;
                    for (LocalDate date = start.withDayOfMonth(Math.min(dayOfMonth, start.lengthOfMonth()));
                         !date.isAfter(end);
                         date = date.plusMonths(monthlyInterval).withDayOfMonth(Math.min(dayOfMonth, date.plusMonths(monthlyInterval).lengthOfMonth()))) {
                        dates.add(date);
                    }
                }
                break;

            case "NF": // 빈도 없음
                try {
                    dates.add(LocalDate.parse(plan.getInspPlanDt(), DATE_FORMATTER));
                } catch (DateTimeParseException e) {
                    log.error("Invalid date format for NF case: {}. Expected format: yyyyMMdd", plan.getInspPlanDt());
                    throw new CustomException(ErrorCode.INVALID_INPUT_VALUE);
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
     * @param week 주 코드 (예: MO, TU, ...)
     * @return DayOfWeek 열거형
     */
    private DayOfWeek getDayOfWeekFromWeek(String week) {
        if (week == null || week.isEmpty()) {
            return DayOfWeek.MONDAY; // 기본값
        }
        switch (week.toUpperCase()) {
            case "MO":
                return DayOfWeek.MONDAY;
            case "TU":
                return DayOfWeek.TUESDAY;
            case "WE":
                return DayOfWeek.WEDNESDAY;
            case "TH":
                return DayOfWeek.THURSDAY;
            case "FR":
                return DayOfWeek.FRIDAY;
            case "SA":
                return DayOfWeek.SATURDAY;
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

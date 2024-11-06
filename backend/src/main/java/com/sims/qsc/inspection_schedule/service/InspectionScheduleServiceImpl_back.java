//package com.sims.qsc.inspection_schedule.service;
//
//import com.sims.config.common.aop.SVInspectorRolCheck;
//import com.sims.qsc.inspection_schedule.mapper.InspectionScheduleMapper;
//import com.sims.qsc.inspection_schedule.vo.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.eclipse.tags.shaded.org.apache.bcel.generic.RETURN;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.DayOfWeek;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.time.temporal.TemporalAdjusters;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class InspectionScheduleServiceImpl implements InspectionScheduleService {
//
//    private final InspectionScheduleMapper scheduleMapper;
//
//
//    public List<InspectionScheduleRequest> selectFilteredInspectionScheduleList(
//            String storeNm, String brandNm, String scheduleDate, String chklstNm, String inspector, String frqCd,  String cntCd,  String currentMbrNo) {
//        return scheduleMapper.selectFilteredInspectionScheduleList(
//                storeNm, brandNm, scheduleDate, chklstNm, inspector, frqCd, cntCd, currentMbrNo
//        );
//    }
//
//    @Override
//    public List<Map<String, Object>> selectAllStores(String currentMbrNo) { return scheduleMapper.selectAllStores(currentMbrNo); }
//
//
//    @Override
//    public List<String> selectAllBrands() {
//        return scheduleMapper.selectAllBrands();
//    }
//
//    @Override
//    public List<String> selectAllChecklists() {
//        return scheduleMapper.selectAllChecklists();
//    }
//
//    @Override
//    public List<String> selectAllInspectors() {
//        return scheduleMapper.selectAllInspectors();
//    }
//
//    @Override
//    public List<Map<String, Object>> selectBottomChkLst() { return scheduleMapper.selectBottomChkLst(); }
//
//    @Override
//    public List<String> selectBottomINSP() { return scheduleMapper.selectBottomINSP(); }
//
//    @Override
//    public List<InspectionDetailsResponse> selectInspectionDetails(Integer storeId) { return scheduleMapper.selectInspectionDetails(storeId); }
//
//    /**
//     * 점검 계획을 삽입하거나 업데이트하고, 해당 계획에 따른 점검 일정을 생성하는 메서드
//     *
//     * @param inspectionPlans 저장할 점검 계획 목록
//     */
//    @Override
//    @Transactional
//    @SVInspectorRolCheck
//    public void insertOrUpdateInspectionPlans(List<InspectionPlan> inspectionPlans) {
//
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        String currentMemberId = auth.getName();  // 로그인 한 사람
//        log.info("@@@@@@@@@@@@@");
//        log.info(inspectionPlans.toString());
//
//
//        // 1. 점검 계획 저장/수정
//        saveInspectionPlans(inspectionPlans, currentMemberId);
//
//        // 2. 점검 일정 생성 준비
//        List<InspectionSchedule> schedulesToSave = new ArrayList<>();
//        LocalDate today = LocalDate.now();
//        LocalDate endDate = today.plusMonths(3);
//
//        for (InspectionPlan plan : inspectionPlans) {
//            // 점검 계획이 활성화되지 않은 경우 일정 생성하지 않음
//            if (!"Y".equals(plan.getInspPlanUseW())) {
//                continue;
//            }
//
//            // 점검 일정 날짜 생성
//            List<LocalDate> inspectionDates = generateInspectionDates(plan, today, endDate);
//
//            for (LocalDate date : inspectionDates) {
//                // 주말 제외
//                if (isWeekend(date)) {
//                    continue;
//                }
//
//                // 점검 일정 상세 조회 (inspPlanId를 사용해야 함) 만약 여기서 null 이라면 update
//                InspectionSchedule schedule = scheduleMapper.selectDetailSchedule(plan.getInspPlanId());
//
//                if (schedule == null) { // 일로빠지면 insert
//                    schedule = new InspectionSchedule();
//                    // 새로운 점검 계획 ID 설정
//                    schedule.setInspPlanId(getLastInspPlanSeq() + 1);
//                    schedule.setInspSchdId(getLastInspSchdSeq() + 1);
//                }
//                // 임시객체 mbr
//                MemberRequest  mbrRequest = scheduleMapper.selectMbrDetail(currentMemberId);
//                log.info("mbrRequest : {}", mbrRequest);
//                // 공통 필드 설정 -> update
//                schedule.setStoreId(plan.getStoreId());
//                schedule.setInspPlanDt(plan.getInspPlanDt());
//
//                log.info("schedule : {}", schedule);
//                // 새로운 스케줄일 경우 추가 필드 설정
//                if (schedule.getInspSchdId() == null) {
//                    schedule.setCreTm(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm")));
//                    schedule.setCreMbrId(mbrRequest.getMbrId());
//                    schedule.setInspSchdSttsW("1"); // 새로운 일정의 상태 설정
//                    schedule.setInspSttsCd("IS001");
//
//                }else{
//                    // 수정사항이있는 경우 필드 설정
//                    schedule.setCreTm(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm")));
//                    schedule.setCreMbrId(mbrRequest.getMbrId());
//                    schedule.setInspSchdSttsW("1"); // 새로운 일정의 상태 설정
//                    schedule.setInspSttsCd("IS001");
//                    schedule.setCreMbrId(mbrRequest.getMbrId());
//                    schedule.setUpdMbrId(mbrRequest.getMbrId());
//
//                }
//
//                log.info("Modified schedule: " + schedule);
//                schedulesToSave.add(schedule);
//            }
//        }
//
//        // 3. 점검 일정 저장
//        if (!schedulesToSave.isEmpty()) {
//            scheduleMapper.insertInspectionSchedules(schedulesToSave);
//            log.info(inspectionPlans.toString());
//            log.info("schdule : {}" , schedulesToSave);
//            log.info("점검 일정이 {}개 저장되었습니다.", schedulesToSave.size());
//        }else{
//            log.info("엥  null이야 진짜?");
//        }
//    }
//
//
//    /**
//     * 점검 일정을 배치로 삽입하는 메서드
//     *
//     * @param schedules 저장할 점검 일정 목록
//     */
//    @Override
//    @Transactional
//    public void insertInspectionSchedules(List<InspectionSchedule> schedules) {
//        // 생성 시간 설정
//        LocalDateTime now = LocalDateTime.now();
//        String currentTime = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
//
//        for (InspectionSchedule schedule : schedules) {
//            if (schedule.getCreTm() == null || schedule.getCreTm().isEmpty()) {
//                schedule.setCreTm(currentTime);
//            }
//            if (schedule.getUpdTm() == null || schedule.getUpdTm().isEmpty()) {
//                schedule.setUpdTm(currentTime);
//            }
//        }
//        log.info("@@@@@@@@@@@@@@@@@@@");
//        log.info("schedules : {}" , schedules);
//        // 점검 일정 저장
//        scheduleMapper.insertInspectionSchedules(schedules);
//        log.info("점검 일정이 {}개 저장되었습니다.", schedules.size());
//    }
//
//    @Override
//    public InspectionSchedule selectDetailSchedule(Integer inspPlanId) {
//        return scheduleMapper.selectDetailSchedule(inspPlanId);
//    }
//
//    @Override
//    public MemberRequest selectMbrDetail(String creMbrId) { return scheduleMapper.selectMbrDetail(creMbrId); }
//
//    @Override
//    public Integer getLastInspPlanSeq() {
//        return scheduleMapper.getLastInspPlanSeq();
//    }
//
//    @Override
//    public Integer getLastInspSchdSeq() {
//        return scheduleMapper.getLastInspSchdSeq();
//    }
//
//    /**
//     * 점검 계획 목록을 저장 또는 수정하는 메서드
//     *
//     * @param inspectionPlans 저장할 점검 계획 목록
//     */
//    @Transactional
//    public void saveInspectionPlans(List<InspectionPlan> inspectionPlans, String currentMemberId) {
//        // 생성 시간 설정
//        LocalDateTime now = LocalDateTime.now();
//        String currentTime = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
//
//        for (InspectionPlan plan : inspectionPlans) {
//            if (plan.getInspPlanId() == null||plan.getCreTm() == null || plan.getCreTm().isEmpty()) {
//                plan.setInspPlanId(getLastInspPlanSeq() + 1);
//                plan.setCreTm(currentTime);
//                plan.setCreMbrId(currentMemberId); // 생성자 설정
//
//            }
//            if (plan.getUpdTm() == null || plan.getUpdTm().isEmpty()) {
//                plan.setUpdTm(currentTime);
//                plan.setUpdMbrId(currentMemberId); // 수정자 설정
//            } else {
//                plan.setUpdMbrId(currentMemberId); // 항상 수정자 설정
//            }
//        }
//
//        // 점검 계획 저장/수정
//
//        log.info("점검 계획이 {}개 저장/수정되었습니다.", inspectionPlans.size());
//    }
//
//
//    /**
//     * 점검 계획에 따라 점검 일정 날짜를 생성하는 메서드
//     *
//     * @param plan  점검 계획 객체
//     * @param start 시작 날짜
//     * @param end   종료 날짜 (3개월 후)
//     * @return 생성된 점검 일정 날짜 목록
//     */
//    private List<LocalDate> generateInspectionDates(InspectionPlan plan, LocalDate start, LocalDate end) {
//        List<LocalDate> dates = new ArrayList<>();
//        String frqCd = plan.getFrqCd();
//        String cntCd = plan.getCntCd();
//
//        switch (frqCd) {
//            case "ED": // 일별
//                int dailyInterval = parseInterval(cntCd, "D");
//                for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(dailyInterval)) {
//                    dates.add(date);
//                }
//                break;
//
//            case "EW": // 주별
//                int weeklyInterval = parseInterval(cntCd, "W");
//                DayOfWeek targetDay = getDayOfWeekFromWeek(plan.getWeek());
//                LocalDate firstWeekDate = start.with(TemporalAdjusters.nextOrSame(targetDay));
//                for (LocalDate date = firstWeekDate; !date.isAfter(end); date = date.plusWeeks(weeklyInterval)) {
//                    dates.add(date);
//                }
//                break;
//
//            case "EM": // 월별
//                int monthlyInterval = parseInterval(cntCd, "M");
//                int dayOfMonth = plan.getSlctDt() != null && !plan.getSlctDt().isEmpty() ? Integer.parseInt(plan.getSlctDt()) : 1;
//                for (LocalDate date = start.withDayOfMonth(Math.min(dayOfMonth, start.lengthOfMonth()));
//                     !date.isAfter(end);
//                     date = date.plusMonths(monthlyInterval).withDayOfMonth(Math.min(dayOfMonth, date.plusMonths(monthlyInterval).lengthOfMonth()))) {
//                    dates.add(date);
//                }
//                break;
//
//            case "NF": // 빈도없음
//                dates.add(start);
//                break;
//
//            default:
//                log.warn("알 수 없는 FRQ_CD: {}", frqCd);
//        }
//
//        return dates;
//    }
//
//    /**
//     * CNT_CD에서 인터벌 값을 추출하는 메서드
//     *
//     * @param cntCd    CNT_CD 값
//     * @param prefixCd CNT_CD의 접두사 (D, W, M 등)
//     * @return 인터벌 값
//     */
//    private int parseInterval(String cntCd, String prefixCd) {
//        if (cntCd == null || !cntCd.startsWith(prefixCd)) {
//            return 1; // 기본 인터벌은 1
//        }
//        try {
//            return Integer.parseInt(cntCd.substring(1));
//        } catch (NumberFormatException e) {
//            log.warn("CNT_CD 파싱 실패: {}, 기본 인터벌 사용", cntCd);
//            return 1;
//        }
//    }
//
//    /**
//     * 주어진 주 코드에서 DayOfWeek를 반환하는 메서드
//     *
//     * @param week 주 코드 (예: MON, TUE, ...)
//     * @return DayOfWeek 열거형
//     */
//    private DayOfWeek getDayOfWeekFromWeek(String week) {
//        if (week == null || week.isEmpty()) {
//            return DayOfWeek.MONDAY; // 기본값
//        }
//        switch (week.toUpperCase()) {
//            case "MON":
//            case "MO":
//                return DayOfWeek.MONDAY;
//            case "TUE":
//            case "TU":
//                return DayOfWeek.TUESDAY;
//            case "WED":
//            case "WE":
//                return DayOfWeek.WEDNESDAY;
//            case "THU":
//            case "TH":
//                return DayOfWeek.THURSDAY;
//            case "FRI":
//            case "FR":
//                return DayOfWeek.FRIDAY;
//            case "SAT":
//            case "SA":
//                return DayOfWeek.SATURDAY;
//            case "SUN":
//            case "SU":
//                return DayOfWeek.SUNDAY;
//            default:
//                return DayOfWeek.MONDAY; // 기본값
//        }
//    }
//
//    /**
//     * 주어진 날짜가 주말인지 확인하는 메서드
//     *
//     * @param date 확인할 날짜
//     * @return 주말 여부
//     */
//    private boolean isWeekend(LocalDate date) {
//        DayOfWeek dayOfWeek = date.getDayOfWeek();
//        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
//    }
//
//}

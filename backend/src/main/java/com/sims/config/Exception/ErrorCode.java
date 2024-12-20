package com.sims.config.Exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-001", "서버 에러, 관리자에게 문의 바랍니다."),

    DUPLICATE_RESOURCE(HttpStatus.CONFLICT, "DATA-001", "데이터가 이미 존재합니다."), // 409
    NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-002", "데이터가 존재하지 않습니다."), // 404
    INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "DATA-003", "파라미터가 유효하지 않습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "DATA-004", "입력값이 유효하지 않습니다."),
    CHECKLIST_IN_USE(HttpStatus.CONFLICT, "DATA-005", "사용중인 체크리스트입니다."), // 409
    SAVE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "DATA-006", "저장에 실패하였습니다."), // 500
    BRAND_NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-007", "브랜드가 존재하지 않습니다."), // 404
    STORE_NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-008", "가맹점이 존재하지 않습니다."), // 404
    SV_NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-009", "SV가 존재하지 않습니다."), // 404
    INSP_NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-0010", "점검자가 존재하지 않습니다."), // 404
    CHKLST_NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-0011", "체크리스트가 존재하지 않습니다."), // 404
    INSP_TYPE_NOT_FOUND(HttpStatus.NOT_FOUND, "DATA-0012", "점검유형이 존재하지 않습니다."), // 404


    SCHEDULE_IN_USE(HttpStatus.CONFLICT,"DATA-0013","점검일정이 이미 존재합니다."), //409
    RESULT_IN_USE(HttpStatus.CONFLICT,"DATA-0014","점검결과가 존재하는 일정입니다."), //409
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND,"DATA-0015","점검계획이 존재하지않습니다."),

    HAS_EMAIL(HttpStatus.BAD_REQUEST, "ACCOUNT-001", "이미 존재하는 사원번호입니다."),
    DUPLICATE_CHECKLIST_NAME(HttpStatus.BAD_REQUEST, "ACCOUNT-001", "이미 존재하는 체크리스트명입니다."),

    HANDLE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH-001", "권한이 없습니다."),


    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}

package com.sims.qsc.inspection_schedule.vo;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequest {
    private String mbrId;
    private String mbrNo;
    private String mbrNm;
    private String mbrRoleCd;
    private String mbrSttsCd;

}

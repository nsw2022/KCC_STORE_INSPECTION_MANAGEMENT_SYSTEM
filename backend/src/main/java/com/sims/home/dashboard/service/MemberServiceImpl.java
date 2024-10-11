package com.sims.home.dashboard.service;

import com.sims.home.dashboard.domain.Member;
import com.sims.home.dashboard.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService{

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder encoder;

    @Override
    public int registTest() {
        List<String> roleCodes = new ArrayList<>();
        roleCodes.add("ROLE_INSP");

        Member member = Member.builder()
                .mbrNo("C202410001")
                .mbrPw(encoder.encode("1234"))
                .mbrNm("점검자")
                .mbrRoleCd(roleCodes)
                .mbrSttsCd(1)
                .tel("010-1234-5678")
                .hireDt("20241010")
                .creMbrId(1)
                .creTm("202410101010")
                .build();

        log.info("member = {}", member);
        return memberMapper.insertTestMember(member);
    }
}

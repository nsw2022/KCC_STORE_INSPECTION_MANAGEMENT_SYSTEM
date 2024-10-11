package com.sims.home.dashboard.service;

import com.sims.home.dashboard.vo.MemberDao;
import com.sims.home.dashboard.mapper.MemberMapper;
import com.sims.home.dashboard.vo.MemberRegistRequest;
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
    public int regist(MemberRegistRequest member) {
        List<String> roleCodes = new ArrayList<>();
        roleCodes.add(member.getMbrRoleCd());

        MemberDao newMember = MemberDao.builder()
                .mbrNo(member.getMbrNo())
                .mbrPw(encoder.encode(member.getMbrPw()))
                .mbrNm(member.getMbrNm())
                .mbrRoleCd(roleCodes)
                .mbrSttsCd(1)
                .tel(member.getTel())
                .hireDt(member.getHireDt())
                .build();

        log.info("member = {}", newMember);
        return memberMapper.insertTestMember(newMember);
    }
}

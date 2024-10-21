package com.sims.home.member.service;

import com.sims.home.member.vo.MemberDao;
import com.sims.home.member.mapper.MemberMapper;
import com.sims.home.member.vo.MemberRegistRequest;
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

    /**
     * 회원가입 처리 Service
     * @param member
     * @return MemberDao
     */
    @Override
    public int insertMember(MemberRegistRequest member) {
        List<String> roleCodes = new ArrayList<>();
        roleCodes.add(member.getMbrRoleCd());

        MemberDao newMember = MemberDao.builder()
                .mbrNo(member.getMbrNo())
                .mbrPw(encoder.encode(member.getMbrPw()))
                .mbrNm(member.getMbrNm())
                .mbrRoleCd(roleCodes)
                .mbrSttsCd(Integer.toString(1))
                .tel(member.getTel())
                .hireDt(member.getHireDt())
                .creMbrId(member.getCreMbrId())
                .build();

        log.info("member = {}", newMember);
        return memberMapper.insertMbr(newMember);
    }
}

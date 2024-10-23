package com.sims.home.member.service;

import com.sims.home.member.vo.Member;
import com.sims.home.member.mapper.MemberMapper;
import com.sims.home.member.vo.MemberRegistRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
/**
 * @Description 회원가입 / 로그인 관련 서비스 구현 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService{

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder encoder;

    /**
     * 회원가입 처리 Service
     * @param member
     * @return Member
     */
    @Override
    public int insertMember(MemberRegistRequest member) {
        if(memberMapper.selectMbrByMbrNo(member.getMbrNo()) != null){
            return 0;
        }else {
            Member newMember = Member.builder()
                    .mbrNo(member.getMbrNo())
                    .mbrPw(encoder.encode(member.getMbrPw()))
                    .mbrNm(member.getMbrNm())
                    .mbrRoleCd("MR004")
                    .mbrSttsCd(Integer.toString(1))
                    .tel(member.getTel())
                    .hireDt(member.getHireDt())
                    .creMbrId(member.getCreMbrId())
                    .build();

            return memberMapper.insertMbr(newMember);
        }
    }
}

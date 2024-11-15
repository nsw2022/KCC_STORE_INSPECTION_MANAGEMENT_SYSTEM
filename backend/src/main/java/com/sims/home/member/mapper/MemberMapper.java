package com.sims.home.member.mapper;

import com.sims.home.member.vo.Member;
import org.apache.ibatis.annotations.Mapper;
/**
 * @Description 회원가입 / 로그인 관련 매퍼 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Mapper
public interface MemberMapper {
    /**
     * 사원번호(로그인ID)로 사원정보 조회
     * @param mbrNo 사원 번호
     * @return Member 사원 객체
     */
    public Member selectMbrByMbrNo(String mbrNo);

    /**
     * 사원번호(로그인ID)로 사원 ID(식별 번호) 조회
     * @param mbrNo
     * @return 사원 ID(식별 번호)
     */
    public int selectMbrIdByMbrNo(String mbrNo);

    /**
     * DB에 회원가입 정보를 저장하는 메서드
     * @param member
     * @return 저장 성공 1 / 실패 0
     */
    public int insertMbr(Member member);

    /**
     * DB에 마지막 로그인 시간을 저장하는 메서드
     * @param mbrNo
     * @return 저장 성공 1 / 실패 0
     */
    public int updateLastLoginDate(String mbrNo);


}

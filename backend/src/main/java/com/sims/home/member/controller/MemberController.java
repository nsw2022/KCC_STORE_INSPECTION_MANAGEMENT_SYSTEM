package com.sims.home.member.controller;

import com.sims.home.member.service.MemberService;
import com.sims.home.member.vo.MemberRegistRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @Description 회원가입 / 로그인 관련 컨트롤러 클래스
 * @Author 유재원
 * @Date 2024.10.23
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class MemberController {
    private final MemberService memberService;

    /**
     * 로그인 화면 호출
     * @return 로그인 페이지
     */
    @GetMapping("/login")
    public String login() {
        return "home/login/login";
    }

    /**
     * 로그인 처리
     * @return 메인 페이지
     */
    @PostMapping("/loginprocess")
    public String loginProcess() {
        return "redirect:/";
    }

    /**
     * 회원가입 처리
     * @param member 회원가입 정보
     * @return 회원가입 결과
     */
    @PostMapping("/regist")
    @ResponseBody
    public ResponseEntity<String> insertMember(@RequestBody MemberRegistRequest member) {
        if(memberService.insertMember(member) == 1)
            return new ResponseEntity<>("success", HttpStatus.OK);
        else
            return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
    }
}

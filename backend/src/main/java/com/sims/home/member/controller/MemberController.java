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

@Controller
@RequiredArgsConstructor
@Slf4j
public class MemberController {
    private final MemberService memberService;

    /**
     * 로그인 화면
     * @return login
     */
    @GetMapping("/login")
    public String login() {
        return "home/login/login";
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/loginprocess")
    public String loginProcess() {
        return "redirect:/";
    }

    /**
     * 회원가입 처리
     * @param member
     * @return
     */
    @PostMapping("/regist")
    @ResponseBody
    public ResponseEntity<String> insertMember(@RequestBody MemberRegistRequest member) {
        log.info("request = {}", member);
        int result = memberService.insertMember(member);
        if(result == 1)
            return new ResponseEntity<>("success", HttpStatus.OK);
        else
            return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
    }
}

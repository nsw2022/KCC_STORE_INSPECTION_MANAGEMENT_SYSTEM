package com.sims.home.dashboard.controller;

import com.sims.home.dashboard.domain.Member;
import com.sims.home.dashboard.mapper.MemberMapper;
import com.sims.home.dashboard.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final MemberService memberService;

    @GetMapping("/")
    public String index() {
        return "index";
    }
    
    @GetMapping("/login")
    public String login() {
    	return "home/login/login";
    }

    @PostMapping("/loginProcess")
    public String loginProcess() {
        return "redirect:/";
    }

    @GetMapping("/regist/test")
    @ResponseBody
    public ResponseEntity<String> registTest() {
        int result = memberService.registTest();
        if(result == 1)
            return new ResponseEntity<>("success", HttpStatus.OK);
        else
            return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
    }
}

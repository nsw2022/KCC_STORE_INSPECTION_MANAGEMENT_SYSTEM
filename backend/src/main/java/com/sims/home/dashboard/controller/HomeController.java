package com.sims.home.dashboard.controller;

import com.sims.home.dashboard.service.MemberService;
import com.sims.home.dashboard.vo.MemberRegistRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final MemberService memberService;

    @GetMapping("/")
    public String index() {
        return "home/dashboard/dashboard";
    }
    
    @GetMapping("/login")
    public String login() {
    	return "home/login/login";
    }

    @PostMapping("/loginProcess")
    public String loginProcess() {
        return "redirect:/";
    }

    @PostMapping("/regist")
    @ResponseBody
    public ResponseEntity<String> registTest(@RequestBody MemberRegistRequest member) {
        log.info("request = {}", member);
        int result = memberService.regist(member);
        if(result == 1)
            return new ResponseEntity<>("success", HttpStatus.OK);
        else
            return new ResponseEntity<>("fail", HttpStatus.BAD_REQUEST);
    }
}

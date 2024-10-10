package com.sims.home.dashboard.controller;

import com.sims.home.dashboard.domain.Member;
import com.sims.home.dashboard.mapper.MemberMapper;
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

    private final MemberMapper memberMapper;
    private final BCryptPasswordEncoder encoder;

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

    @GetMapping("/test")
    @ResponseBody
    public ResponseEntity<String> test() {
        // 권한 코드를 위한 리스트 생성
        List<String> roleCodes = new ArrayList<>();
        roleCodes.add("ROLE_ADMIN");

        Member member = Member.builder()
                .mbrNo("A202410001")
                .mbrPw(encoder.encode("1234"))
                .mbrNm("admin")
                .mbrRoleCd(roleCodes)
                .mbrSttsCd(1)
                .tel("010-1234-5678")
                .hireDt("20241010")
                .creMbrId(1)
                .creTm("202410101010")
                .build();

        log.info("member = {}", member);
        memberMapper.insertTestMember(member);
        return new ResponseEntity<>("success", HttpStatus.OK);
    }
}

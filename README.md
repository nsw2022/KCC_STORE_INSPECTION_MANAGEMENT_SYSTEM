# Kcc 정보통신 FINAL 프로젝트 

## 프로젝트 소개
* 프로젝트명 : KCC_STORE_INSPECTION_MANAGEMENT_SYSTEM
  > 사수(멘토) 와의 소통과 질의 응답을 통해 협업과 문제 해결 과정에서 얻은 경험을 바탕으로 성장을 지향합니다.
* 목표
  > 요구사항에 충실한 프로젝트를 진행하며, 점검 관리 프로세스를 체계적으로 정립하고, 사용자 친화적인 UI/UX를 통해 효율성을 극대화 합니다.<br>
  > 가맹점의 위생 및 제품 품질을 개선하고, 효과적인 개선 방안을 제시하여 고객 만족도를 높입니다.<br>
  > 우리는 KCC 정보통신의 신입사원으로 가정하고 프로젝트에 임했으며, 실무 역량을 쌓는 것을 첫 번째 목표로 합니다.

### :mantelpiece_clock: 개발 기간
- 2024.09.23 ~ 2024.11.15

## 🛠️ 개발 환경

### **FrontEnd**
- **Languages & Frameworks**: JSP, JavaScript (JS), JQuery, Bootstrap
- **Visualization Tools**: ApexChart, AG-Grid
- **Cloud Integration**: Naver Cloud

### **BackEnd**
- **Languages & Frameworks**: Java, Spring Boot
- **Libraries**: Spring Security, MyBatis
- **Database**: Oracle
- **Build Tool**: Maven

### **Infra**
- **Cloud & Hosting**: AWS EC2, S3, Docker
- **Servers**: Tomcat, Oracle Cloud
- **CI/CD**: Jenkins
- **Security**: Certbot

### **Tools**
- **Development & Collaboration**: GitHub, Postman, eGov Framework
- **Design & Documentation**: Figma, Notion

  아래는 Spring Security 적용 내용을 README에 맞게 간결하고 정리된 형식으로 작성한 예입니다:

### :gear: 주요 기능

## 🛡️ Spring Security 적용

Spring Security를 활용하여 **사용자 인증(Authentication)**과 **권한 관리(Authorization)**를 구현하였습니다. 이를 통해 URL 접근 제어, 로그인/로그아웃 처리, 비밀번호 암호화와 같은 보안 기능을 제공하였습니다.

### **주요 기능**

1. **패스워드 암호화**
   - `BCryptPasswordEncoder`를 사용하여 사용자의 비밀번호를 암호화.
   - 데이터베이스에 안전한 형태로 비밀번호를 저장하고, 인증 과정에서 비교 검증.

2. **URL 접근 제어**
   - 인증 없이 접근 가능한 경로(화이트리스트)를 설정:
     ```
     /resources/**
     /login
     /WEB-INF/views/home/login/login.jsp
     ```
   - 화이트리스트 외의 모든 요청은 인증 필요.
   - 권한별 접근 제어를 위한 추가 설정이 가능하도록 유연한 구조를 유지.

3. **로그인 처리**
   - 사용자 정의 로그인 페이지(`/login`)와 인증 로직을 적용.
   - 로그인 성공 시 `CustomAuthenticationSuccessHandler`로 후속 작업 처리.
   - 로그인 실패 시 `CustomAuthenticationFailureHandler`로 오류 처리.
   - 사용자 아이디(`mbrNo`)와 비밀번호(`mbrPw`)를 입력받아 `/loginprocess` URL로 인증 요청 처리.

4. **로그아웃 처리**
   - `/logout` URL로 로그아웃 요청을 처리.
   - 로그아웃 성공 후 `/login?logout=true`로 리다이렉트.
   - 세션 무효화 및 쿠키 삭제(`JSESSIONID`)를 통해 사용자 데이터를 안전하게 관리.

5. **CSRF 비활성화**
   - 애플리케이션 요구사항에 따라 CSRF 보호 기능을 비활성화.

---

### **Spring Security 설정 코드 요약**
<details> <summary>코드 요약</summary>

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable);

    http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/resources/**", "/login", "/WEB-INF/views/home/login/login.jsp").permitAll()
            .anyRequest().authenticated()
    );

    http.formLogin(auth -> auth
            .loginPage("/login")
            .successHandler(customAuthenticationSuccessHandler)
            .failureHandler(customAuthenticationFailureHandler)
            .usernameParameter("mbrNo")
            .passwordParameter("mbrPw")
            .loginProcessingUrl("/loginprocess")
    );

    http.logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login?logout=true")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID")
    );

    return http.build();
}
```
</details>

---

### **적용 효과**
- **보안 강화**: 비밀번호 암호화와 세션 및 쿠키 초기화로 사용자 데이터를 안전하게 보호.
- **효율적인 접근 제어**: 사용자 권한에 따른 URL 접근 관리로 보안성과 편의성 동시 제공.
- **유연한 확장성**: 요구사항에 따라 인증 성공/실패 핸들러 및 URL 권한 제어를 커스터마이징 가능.

---

이와 같은 Spring Security 설정을 통해 프로젝트 요구사항에 적합한 **보안 시스템**을 성공적으로 구현하였습니다.

---


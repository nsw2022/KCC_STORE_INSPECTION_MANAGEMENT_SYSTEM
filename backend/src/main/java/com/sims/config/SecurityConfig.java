package com.sims.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final String[] JSP_LIST = {
            "/resources/**",
            "/login",
            "/membership",
            "/nonUser/add",
            "/main",
            "/reservation/**",
            "/join",
            "/payment/**",
            "/duplicated/**",
            "/check/**",
            "/admin/**",
            "/check/payment",
            "/WEB-INF/views/membership.jsp",
            "/WEB-INF/views/login.jsp",
            "/WEB-INF/views/main.jsp",
            "/WEB-INF/views/reservation_detail.jsp",
            "/WEB-INF/views/reservation_seat1.jsp",
            "/WEB-INF/views/reservation_seat2.jsp",
            "/WEB-INF/views/reservation_seat3.jsp",
            "/WEB-INF/views/payment.jsp",
            "/WEB-INF/views/payment_accept.jsp",
            "/WEB-INF/views/payment_finish.jsp",
            "/WEB-INF/views/payment.jsp",
            "/WEB-INF/views/payment_accept.jsp",
            "/WEB-INF/views/payment_finish.jsp"
    };
    private static final String[] USER_JSP_LIST = {
            "/user/**",
            "/WEB-INF/views/mypage.jsp",
            "/WEB-INF/views/mypage_edit.jsp",
            "/WEB-INF/views/reservation_list.jsp",
            "/WEB-INF/views/login.jsp",
            "/WEB-INF/views/main.jsp",
            "/WEB-INF/views/reservation_detail.jsp",
            "/WEB-INF/views/reservation_seat1.jsp",
            "/WEB-INF/views/reservation_seat2.jsp",
            "/WEB-INF/views/reservation_seat3.jsp"
    };
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll()
//                .requestMatchers(JSP_LIST).permitAll()
//                .requestMatchers(USER_JSP_LIST).hasAnyRole("USER", "ADMIN")
//                .requestMatchers("/admin/**").hasAnyRole("ADMIN")
                .anyRequest().authenticated()
        );

//        http.formLogin(auth -> auth
//                .loginPage("/login")
//                .successHandler(new CustomAuthenticationSuccessHandler()) // Custom handler 등록
//                .failureUrl("/login?error=true")
//                .usernameParameter("username")
//                .passwordParameter("password")
//                .loginProcessingUrl("/loginProcess")
//        );
//
//        http.logout(logout -> logout
//                .logoutUrl("/logout")
//                .logoutSuccessUrl("/login?logout=true")
//                .invalidateHttpSession(true)
//                .deleteCookies("JSESSIONID")
//        );

        return http.build();
    }


}
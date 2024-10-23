package com.sims.config.security;

import com.sims.home.member.vo.Member;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;

@RequiredArgsConstructor
public class PrincipalDetail implements UserDetails {

    private static final Logger log = LoggerFactory.getLogger(PrincipalDetail.class);
    private final Member member;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        authorities.add(()->{return member.getMbrRoleCd();});

        return authorities;
    }

    @Override
    public String getPassword() {
        return member.getMbrPw();
    }

    @Override
    public String getUsername() {
        return member.getMbrNo();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return Integer.parseInt(member.getMbrSttsCd()) == 1;
    }
}

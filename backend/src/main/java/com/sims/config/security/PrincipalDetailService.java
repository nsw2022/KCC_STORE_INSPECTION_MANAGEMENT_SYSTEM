package com.sims.config.security;


import com.sims.home.member.vo.MemberDao;


import com.sims.home.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrincipalDetailService implements UserDetailsService {
    private final MemberMapper memberMapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        MemberDao member = memberMapper.selectMbrByMbrId(username);
        if(member == null){
            throw new UsernameNotFoundException("User Not Found");
        }
        return new PrincipalDetail(member);
    }
}

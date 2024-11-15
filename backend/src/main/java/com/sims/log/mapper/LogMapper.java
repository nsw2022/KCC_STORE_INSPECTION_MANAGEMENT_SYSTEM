package com.sims.log.mapper;

import com.sims.log.vo.LoginLogVo;
import com.sims.log.vo.TransactionErrorLogVo;
import com.sims.log.vo.TransactionLogVo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {
    /**
     * DB에 로그인 로그 저장
     * @param loginLog 로그인 로그 VO
     * @return int 로그인 로그 저장 성공 갯수
     */
    public int insertLoginLog(LoginLogVo loginLog);

    /**
     * DB에 트랜잭션 로그 저장
     * @param transactionLogVo 트랜잭션 로그 VO
     * @return int 트랜잭션 로그 저장 성공 갯수
     */

    public int insertTransactionLog(TransactionLogVo transactionLogVo);

    /**
     * DB에 트랜잭션 에러 로그 저장
     * @param transactionErrorLogVo 트랜잭션 에러 로그 VO
     * @return int 트랜잭션 에러 로그 저장 성공 갯수
     */
    public int insertTransactionErrorLog(TransactionErrorLogVo transactionErrorLogVo);
}

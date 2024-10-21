package com.sims.log.mapper;

import com.sims.log.vo.LoginLogVo;
import com.sims.log.vo.TransactionErrorLogVo;
import com.sims.log.vo.TransactionLogVo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LogMapper {
    public int insertLoginLog(LoginLogVo loginLog);

    public int insertTransactionLog(TransactionLogVo transactionLogVo);

    public int insertTransactionErrorLog(TransactionErrorLogVo transactionErrorLogVo);
}

package com.sims.qsc.inspection_result.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InpectionResultVo {
	private int inspResultId;
	private int inspSchdId;
	private String inspStartTm;
	private String inspComplTm;
	private int totalScore;
	private int totalPenalty;
	private int totalBsnSspn;
	private String signImgPath;
	private String totalReview;
	private String inspComplW;
	private String creMbrId;
	private String creTm;

}

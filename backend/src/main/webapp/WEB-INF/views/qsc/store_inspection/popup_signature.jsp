<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>가맹점 점검 팝업</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap"
          rel="stylesheet"
  />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' integrity='sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==' crossorigin='anonymous'/>

  <link rel="stylesheet" href="/resources/css/qsc/store_inspection/popup_signature.css">
  <script src='https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js'></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/signature_pad@4.0.0/dist/signature_pad.umd.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>
<body>

<div class="progress-container">
  <div class="step active">
    <div class="circle complete">
      <i class="fa-solid fa-check"></i>
    </div>
    <p>점검</p>
  </div>
  <div class="line active"></div>
  <div class="step active">
    <div class="circle complete">
      <i class="fa-solid fa-check"></i>
    </div>
    <p>결과확인</p>
  </div>
  <div class="line active"></div>
  <div class="step">
    <div class="circle active">
      <div class="inner-circle active"></div>
    </div>
    <p>서명</p>
  </div>
  <div class="line"></div>
  <div class="step">
    <div class="circle">
      <div class="inner-circle"></div>
    </div>
    <p>확인</p>
  </div>
</div>

<section class="inspection-detail" id="inspection-detail">
<%--  <div class="inspection-info">--%>
<%--    <table class="inspection-table">--%>
<%--      <tr>--%>
<%--        <td class="info-title">--%>
<%--          <p>KCC 크라상 점포 위생점검표_2024</p>--%>
<%--        </td>--%>
<%--        <td class="info-details">--%>
<%--          <span class="store-name">KCC 크라상</span>--%>
<%--          <span class="store-subtitle">가맹점 (이름예시 아무거나 추가하기)</span>--%>
<%--          <span class="inspection-date">점검일 : 2024.09.24</span>--%>
<%--          <span class="inspector-name">점검자 : 노승우</span>--%>
<%--        </td>--%>
<%--      </tr>--%>
<%--    </table>--%>
<%--  </div>--%>
</section>

<section class="signature-container">
  <!-- 서명 박스 -->
  <div class="signature-area">
    <canvas id="signatureCanvas"></canvas>
    <div class="signature-placeholder">서명을 진행해주세요</div>
  </div>
  <!-- 정보 입력 칸 -->
  <div class="details-section">
    <div>
      <label for="visitDate">재방문일</label>
      <input type="date" id="visitDate" value="2024-10-03">
    </div>
    <div>
      <label for="summaryText">총평</label>
      <textarea id="summaryText" placeholder="총평을 작성해주세요"></textarea>
    </div>
  </div>
</section>
<div id="go-inspection-wrap">
  <button class="go-inspection" onclick="lastCheckInspection()">점검확인 완료</button>
<%--  <button class="go-inspection" onclick="tenpoirySave()">임시저장</button>--%>
</div>

</body>
<script src="/resources/js/qsc/store_inspection/popup_signature.js"></script>
</html>

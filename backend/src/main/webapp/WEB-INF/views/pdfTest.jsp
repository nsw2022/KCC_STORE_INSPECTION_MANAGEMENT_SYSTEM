<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8"/>
    <title>PDF 생성 테스트</title>

    <style>
        @page {
            margin: 0%;
            size: A4 portrait;
        }

        body {
            font-family: "Noto Sans KR", sans-serif;
            margin: 20px;
        }

        #content {
            border: 1px solid #ccc;
            padding: 20px;
        }

        .button-group {
            margin-top: 20px;
        }

        button {
            padding: 10px 20px;
            margin-right: 10px;
            font-size: 16pt;
        }

        @media print {
            /* 인쇄 시 버튼 그룹 숨기기 */
            .button-group {
                display: none;
            }

            /* 인쇄 시 #searchdate 표시 */
            #searchdate {
                display: block;
            }

            /* 필요 시 다른 인쇄 스타일 추가 */
        }

        /* 추가적으로 인쇄 전용 스타일을 정의할 수 있습니다 */
        .print-only {
            display: none;
        }

        @media print {
            .print-only {
                display: block;
            }
        }
    </style>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        function fn_printClick() {
            // 인쇄 전에 추가적인 콘텐츠를 추가
            addPrintContent();

            // 인쇄 실행
            window.print();

            // 인쇄 후에 추가된 콘텐츠를 제거
            removePrintContent();
        }

        function addPrintContent() {
            // 예: 인쇄 전용 콘텐츠 추가
            var printContent = document.createElement('div');
            printContent.id = 'additionalContent';
            printContent.className = 'print-only';
            printContent.innerHTML = '<p>추가된 인쇄 전용 내용입니다.</p>';

            // #content 안에 추가
            document.getElementById('content').appendChild(printContent);
        }

        function removePrintContent() {
            // 예: 인쇄 후 추가된 콘텐츠 제거
            var printContent = document.getElementById('additionalContent');
            if (printContent) {
                printContent.parentNode.removeChild(printContent);
            }
        }
    </script>
</head>
<body>
<div id="main">
    <h1>PDF 생성 테스트 페이지</h1>
    <div id="content">
        <h2>안녕하세요!</h2>
        <p>PDF 생성 테스트를 위한 예제입니다.</p>
        <div id="iframelist">
            <div id="searchdate" style="display: none;">
                <p>검색 날짜: 2024-10-15</p>
            </div>
        </div>
    </div>
    <fieldset class="button-group">
        <legend>숨겨지는 공간</legend>
        <button onclick="fn_printClick()">PDF 생성</button>
        <br><br>
        <b>버튼 영역 은 css에서 @media print 로 숨길수 있습니다.</b>
        <br><br>
        <b>인쇄할때 동적제어를 원한다면 fn_printClick() 안에 동적로직을 보면됩니다. </b>
    </fieldset>
</div>
</body>
</html>

document.addEventListener('DOMContentLoaded', function () {
});


function startInspection() {
    // form 태그를 생성해서 POST 방식으로 페이지 전환
    var form = document.createElement("form");
    form.method = "POST";
    form.action = "/qsc/popup_page_inspection";
    document.body.appendChild(form);
    form.submit();
}




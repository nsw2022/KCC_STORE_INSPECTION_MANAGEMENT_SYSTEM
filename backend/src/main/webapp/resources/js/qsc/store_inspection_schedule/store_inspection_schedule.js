var currentDate = new Date();

/* 캘린더 헤더 JS */
function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar(currentDate);
}

// 점검자 검색 
class Autocomplete {
/**
* 생성자
* @param {jQuery} $input_area - 자동완성을 적용할 input_area 요소
* @param {Array} dataList - 자동완성에 사용할 데이터 목록
*/
// js에서는 변수에 나 객체요! 를 명시할때 변수앞에 $써서 표기
constructor($input_area, dataList) {
this.$input_area = $input_area; 
this.$searchBtn = $input_area.find(".search-btn");
this.$input = $input_area.find("input");
this.$options = $input_area.find(".options");
this.dataList = dataList;

this.init();
}

/**
* 초기화 메서드
* 이벤트 리스너를 설정하고 초기 리스트를 렌더링
*/
init() {
this.renderOptions();
this.bindEvents();
}

/**
* 옵션 리스트를 렌더링.
* @param {string} [selectedItem] - 선택된 아이템을 표시
*
*/
renderOptions(selectedItem = null) {
this.$options.empty();
this.dataList.forEach((item) => {
const isSelected = item === selectedItem ? "selected" : "";
const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item">${item}</li>`;
this.$options.append(li);
});
}

/**
* 필터링된 옵션 리스트를 렌더링
* @param {string} query - 검색어
* @description - li에 class나 id를 넣고 싶다면 여기서 추가할 것
*/
filterOptions(query) {
const filtered = this.dataList.filter((item) =>
item.toLowerCase().includes(query.toLowerCase()),
);

this.$options.empty();
if (filtered.length > 0) {
filtered.forEach((item) => {	
const isSelected =
item === this.$searchBtn.children().first().text()
  ? "selected"
  : "";
const li = `<li onclick="window.updateName(this)" class="${isSelected} autocomplete-item" >${item}</li>`;
this.$options.append(li);
});
} else {
this.$options.html(
`<p style="margin-top: 10px;">찾으시는 항목이 없습니다.</p>`,
);
}
}

/**
* 이벤트 리스너를 바인딩
*/
bindEvents() {
// 검색 버튼 클릭 시 옵션 리스트 토글
this.$searchBtn.on("click", (e) => {
e.stopPropagation(); // 이벤트 버블링 방지
$(".input_area").not(this.$input_area).removeClass("active"); // 다른 input_area의 active 클래스 제거
this.$input_area.toggleClass("active");
this.$input.focus();
});

// 입력 필드 키업 이벤트 처리
this.$input.on("keyup", (e) => {
e.stopPropagation(); // 이벤트 버블링 방지
const query = this.$input.val();
if (query) {
this.filterOptions(query);
} else {
this.renderOptions();
}
});

// 외부 클릭 시 옵션 리스트 숨기기
$(document).on("click", (e) => {
if (
!this.$input_area.is(e.target) &&
this.$input_area.has(e.target).length === 0
) {
this.$input_area.removeClass("active");
}
});
}

/**
* 선택된 아이템을 업데이트
* @param {string} selectedItem - 선택된 아이템 텍스트
*/
updateSelected(selectedItem) {
this.$input.val("");
this.renderOptions(selectedItem);
this.$input_area.removeClass("active");
this.$searchBtn.children().first().text(selectedItem);
}
}

/**
* 전역 함수로 선택된 아이템을 업데이트합니다.
* @param {HTMLElement} selectedLi - 선택된 li 요소
*/
window.updateName = function (selectedLi) {
const selectedText = $(selectedLi).text();
// 해당 li가 속한 input_area를 찾습니다.
const $input_area = $(selectedLi).closest(".input_area");
const instance = $input_area.data("autocompleteInstance");
if (instance) {
instance.updateSelected(selectedText);
}
};

// 각 자동완성 필드에 대한 데이터 목록 정의
/**
* @todo responseBody로 받아올것이라면 여기서 Ajax로 데이터를 요청하면 됨
*
*/
const autocompleteData = {
inspector: ["노승우", "이지훈", "유재원", "원승언", "노승수", "유재수", "이지수", "원승수"],

inspection_type: ["위생 점검", "제품 점검", "정기 점검", "기획 점검", "비정기 점검"],
};

// 자동완성 인스턴스를 초기화하고 input_area 요소에 저장
$(".input_area").each(function () {
const $input_area = $(this);
const type = $input_area.data("autocomplete");
if (type && autocompleteData[type]) {
const autocomplete = new Autocomplete($input_area, autocompleteData[type]);
$input_area.data("autocompleteInstance", autocomplete);
}
});

// '전체 선택' 체크박스 클릭 시
$("#checkAll").click(function () {
// 모든 'checkItem' 체크박스에 대해 체크 상태를 'checkAll'과 동일하게 설정
$(".checkItem").prop("checked", this.checked);
});

// 개별 체크박스가 클릭될 때
$(".checkItem").click(function () {
// 'checkItem' 체크박스 중 하나라도 해제되면 'checkAll' 체크박스 해제
if ($(".checkItem:checked").length === $(".checkItem").length) {
$("#checkAll").prop("checked", true);
} else {
$("#checkAll").prop("checked", false);
}
});


/* 캘린더 헤더 JS 끝 */

/* 캘린더 본문 JS */

function generateCalendar(date) {
    var wra = document.getElementById("wrapper");
    var currentDateDiv = document.getElementById("currentDate");

    wra.innerHTML = `
<div class="div_week">
  <div>일</div>
  <div>월</div>
  <div>화</div>
  <div>수</div>
  <div>목</div>
  <div>금</div>
  <div>토</div>
</div>

<div class="div_calendar"></div>

`;
    currentDateDiv.textContent = date.getFullYear() + "년 " + (
        "0" + (
            date.getMonth() + 1
        )
    ).slice(-2) + "월";

    date.setDate(1);
    var firstDay = date.getDay();
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    var div_calendar = $('#wrapper').find('.div_calendar');

    var html = `<div class='text-end pe-2'></div>`;

    for (let i = 0; i < firstDay; i++) {
        div_calendar.append(html);
    }

    for (let i = 1; i <= lastDay; i++) {
        // 날짜 칸
        const dayDiv = document.createElement("div");
        dayDiv.className += 'text-end pe-2';
        const day = i.toString().padStart(2, '0'); // 01, 02 형식으로 변환
        const month =(date.getMonth()+1).toString().padStart(2, '0');
        dayDiv.setAttribute('data-day', `${date.getFullYear()}-${month}-${day}`);

        // 날짜 칸의 헤더 영역
        var dayDivHeader = document.createElement("div");
        dayDivHeader.className += 'day_div_header mb-3 mt-2 d-flex align-items-center ps-2';
        


        dayDiv.append(dayDivHeader);
        

        // 날짜 텍스트(날짜 칸의 헤더에 들어간다.)
        const day_span = document.createElement("span");
        day_span.textContent = date.getMonth() + 1 + "/" + i;
        dayDivHeader.append(day_span);
        
        // 날짜 칸의 본문 영역
        const dayDiv_content = document.createElement("div");
        dayDiv_content.className += 'day_div_content ps-2';
                            
        dayDiv_content.setAttribute('data-day', `${date.getFullYear()}-${month}-${day}`);
        

        dayDiv.append(dayDiv_content);

        div_calendar.append(dayDiv);
    }


    // 캘린더 일자 박스 개수
    const divLength = document.querySelectorAll('.div_calendar > div').length;


    if (divLength % 7 !== 0) {
        for (let i = 1; i <= (7 - (divLength % 7)); i++) {
            const dayDiv = document.createElement("div");
            dayDiv.className += 'text-end pe-2';
            div_calendar.append(dayDiv);
        }
    }

}

document.addEventListener("DOMContentLoaded", function () {
    generateCalendar(currentDate);
});




$(function () {
    // 토 / 일의 경우 backgroun가 #cccccc였는데 밑의 filter function구문으로 다른 요일의 배경색과 같이 만들어줌
    $('#wrapper').children().filter(function () {
        if ($(this).text() === '토' || $(this).text() === '일') {
            return $(this).css('background-color', '#ffffff');
        }
    })
    
    // 캘린더 date 개수
    let day_div_children_length = document.getElementById('wrapper').childNodes[3].childNodes.length;
    

    // 캘린더 안의 개수에 따른 높이 조절
    function resize_height(day_div_children_length) {
        day_div_children_length = document.getElementById('wrapper').childNodes[3].childNodes.length
        if(day_div_children_length <=28) {
            $('.div_calendar').children().css('height', '25%');
        } else if (day_div_children_length <= 35) {
            $('.div_calendar').children().css('height', '20%');
        } else if (day_div_children_length > 35) {
            $('.div_calendar').children().css('height', '16.6%');
        }
        
    
    $.ajax({
		url : '/qsc/schedule',
		method : 'GET',
		success : function(data) {
		// 날짜마다 점검할 장소(날짜 칸의 본문영역에 들어감) 
					
			$.each(data, function (index, item) {
				let insp_plan_date = item.inspPlanDt.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
				let insp_date_content = $(`.day_div_content[data-day='${insp_plan_date}']`);
				let chklst_nm = item.chklstNm.replace('체크리스트', '');
				let store_nm = item.storeNm;
				let inspector_nm = item.mbrNm;
				console.log(inspector_nm);
				let inspection_places =
				`
					<div class="store_inspection align-items-center ps-2 mb-2 d-flex" data-bs-toggle="modal" data-bs-target="#storeChecklistModal">
				        <div class="store_inspection_store">${store_nm + ' ' + chklst_nm}</div>  
				    	<div class="store_inspection_inspector hide">점검자: <span class="inspector_text">${inspector_nm}</span></div>  
				    </div>
				`;	
				insp_date_content.append(inspection_places);
			})
			
    	// 날짜마다 점검할 장소 목록 끝
    	
    	// 점검할 장소 목록의 크기가 날짜 칸보다 클 경우 버튼이 생김(날짜 칸의 헤더영역에 들어감)

        let span_cnt = $('#wrapper .div_calendar .text-end .day_div_header span');

    
        $.each(span_cnt, function (index, item) {
          // 점검할 장소 목록
          let store_inspection_places = $(this).parent('.day_div_header').siblings().find('.store_inspection').length;
        
          // 버튼 만들기
          if(store_inspection_places > 4)    {
              let html = `<button class="more_btn border border-1 d-flex align-items-center"><span class="store_cnt">${store_inspection_places-4}</span><span class="ms-1">더보기</span></button>`;
              $(this).before(html);
          } else if(store_inspection_places > 0) {
            let html = `<button class="more_btn border border-1 d-flex align-items-center"><span class="store_cnt">${store_inspection_places}</span><span class="ms-1">더보기</span></button>`;
            

            $(this).before(html);
            $('.store_cnt').css('display', 'none');
          }
        
        })
		
		}
		
		
	})		


      
    
      let span_cnt = $('#wrapper .div_calendar .text-end .day_div_header span');

      $(window).resize(function () {
        changeMoreBtnText(window.innerWidth, span_cnt);
      });

      changeMoreBtnText(window.innerWidth, span_cnt);

      // 점검할 장소 목록의 크기가 날짜 칸보다 클 경우 버튼이 생김(날짜 칸의 헤더영역에 들어감) 끝
    
    
    }

    // 캘린더 안의 개수에 따른 높이 조절 function 끝
    
    
    // 페이지의 width에 따라 더보기 버튼의 형태 변형

    
    function changeMoreBtnText(width, span_cnt) {
        if(width <= 1200) {
            $.each(span_cnt, function(index, item) {
                
                let store_cnt = $(this).parent('.day_div_header').siblings().find('.store_inspection').length;
                $(this).siblings().find('.store_cnt').text(store_cnt);
                $(this).siblings().find('.store_cnt').css('display', 'block');
            })
        } else if(width >1200) {
            $.each(span_cnt, function(index, item) {
                
                let store_cnt = $(this).parent('.day_div_header').siblings().find('.store_inspection').length;
                $(this).siblings().find('.store_cnt').text(store_cnt-4);
                if(store_cnt-4<=0) {
                    $(this).siblings().find('.store_cnt').css('display', 'none');
                }
            })
        }
    }

    // 페이지의 width에 따라 더보기 버튼의 형태 변형 function 끝
    


    // 처음 화면에도 캘린더 세로 개수에 따라 높이를 조절해야하기 때문에 resize_height function 사용함
    resize_height(day_div_children_length);
    

    // 날짜 세로 크기를 조절
    $('.select_date_btn_area >button').click(function () {
        resize_height(day_div_children_length);
    });

    // 가맹점 상세 목록 닫힐 때 원래 목록 보여주기
    function show_original_store_list(context) {
        // 4개의 가맹점 목록의 부모 요소
        let day_div_content = context.parents('.text-end').find('.day_div_content');
        
        // 4개의 가맹점 목록
        let store_list = context.parents('.text-end').find('.store_inspection');
        
        context.parents('.store_list_detail').addClass('hide');
        context.parents('.text-end').find('.store_inspection').addClass('d-flex').removeClass('row');
        context.parents('.text-end').find('.store_inspection').children().removeClass('col-xxl-6');
        context.parents('.text-end').find('.store_inspection_inspector').addClass('hide');
        context.parents('.text-end').find('.day_div_header').removeClass('hide');
        
        // store_list를 다시 추가
        day_div_content.append(store_list);
    }

    
    // 가맹점 목록 자세히 보여주기
    $('body').on('click','.text-end[data-day^="20"] .more_btn', function () {
      // 날짜 칸
      let calendar_box = $(this).parents('.text-end');
      

      // 날짜 칸에서 해당 날짜
      let calendar_day = $(this).parents('.text-end').data('day');

      // 가맹점 목록
      let store_list = $(this).parents('.text-end').find('.store_inspection');

      $(this).parents('.text-end').siblings('.text-end').find('.store_list_detail').each(function () {
        show_original_store_list($(this));
        $(this).remove();
      });

      // 더보기 버튼 눌렀을 때 나오는 요소
      let html =
      `
        <div class="store_list_detail px-3">
          <div class="detail_header_area d-flex justify-content-between text-align-items">
            <div class="detail_header_text">${calendar_day}</div>
            <button class="close_btn"><i class="fa-solid fa-xmark" style="color: #b3b3b3"></i></button>
          </div>
          <div class="store_list"></div>
        </div>  
      `;


      // 가맹점 목록 css 수정
      $(this).parents('.text-end').find('.store_inspection').find('.store_inspection_inspector').removeClass('hide');
      $(this).parents('.text-end').find('.store_inspection').removeClass('d-flex').addClass('mx-0 row');
      $(this).parents('.text-end').find('.store_inspection').children().addClass('col-xxl-6');
      
      
      calendar_box.prepend(html);


      let store_list_area = $('.store_list');
      store_list_area.append(store_list);
      

      $(this).parents('.day_div_header').addClass('hide');
      
      
    })

    
    // 가맹점 목록 자세히 보여주기 닫기 

    $('body').on('click','.text-end[data-day^="20"] .close_btn', function () {
      show_original_store_list($(this));
      $(this).parents('.store_list_detail').empty();
    });
    
    // 가맹점 목록 자세히 보여주기 닫기 끝


    // 가맹점 점검할 체크리스트 목록 보여주기
    $('.store_inspection').click(function () {
      
      
      // 가맹점 점검 목록의 부모 요소
      let parent = $(this).parent();

      // 해당 가맹점을 점검하는 점검자 이름
      let inspector_name = $(this).children().eq(1).text();

      // 가맹점명
      let store_name = $(this).children().eq(0).text().split(" ")[0];

      $('.modal_inspector_name').text(inspector_name);
      $('.modal_store_name').text(store_name);


    })

/* 캘린더 본문 JS 끝 */
    
  
  



})

/**
 * 조회 버튼 누를 때 검색에 따라 내용이 변경
 */
async function onSearchRow() {
    let storeName = $('.hide-list').eq(0).find('li.selected').text() || null;
    let brandCode = $('.hide-list').eq(1).find('li.selected').text() || null;
    let inspComplTime = $('#topScheduleDate').val().replaceAll("-", "") || null;
    let chklstName = $('.hide-list').eq(2).find('li.selected').text() || null;
    let inspTypeCode = $('.hide-list').eq(3).find('li.selected').text() || null;
    let mbrName = $('.hide-list').eq(4).find('li.selected').text() || null;

    if (storeName === '전체') {
        storeName = null;
    }

    if (brandCode === '전체') {
        brandCode = null;
    } else if (brandCode === 'KCC 크라상') {
        brandCode = 'B001';
    } else if (brandCode === 'KCC 도넛') {
        brandCode = 'B002';
    } else if (brandCode === 'KCC 브레드') {
        brandCode = 'B003';
    } else if (brandCode === 'KCC 카페') {
        brandCode = 'B004';
    }

    if (chklstName === '전체') {
        chklstName = null;
    }

    if (inspTypeCode === '전체') {
        inspTypeCode = null;
    } else if (inspTypeCode === '제품점검') {
        inspTypeCode = 'IT001';
    } else if (inspTypeCode === '위생점검') {
        inspTypeCode = 'IT002';
    } else if (inspTypeCode === '정기점검') {
        inspTypeCode = 'IT003';
    } else if (inspTypeCode === '비정기점검') {
        inspTypeCode = 'IT004';
    } else if (inspTypeCode === '기획점검') {
        inspTypeCode = 'IT005';
    }

    if (mbrName === '전체') {
        mbrName = null;
    }

    const searchCriteria = {
        storeNm: storeName,
        brandCd: brandCode,
        inspComplTm: inspComplTime,
        chklstNm: chklstName,
        inspTypeCd: inspTypeCode,
        mbrNm: mbrName
    };


    getInspResultAll(searchCriteria);

}

/**
 * 초기화 버튼을 통해 검색된 목록 초기화
 */
function onSearchInit() {
    let storeName = $('.hide-list').eq(0).find('li.selected').text();
    let brandCode = $('.hide-list').eq(1).find('li.selected').text();
    let inspComplTime = $('#topScheduleDate').val().replaceAll("-", "");
    let chklstName = $('.hide-list').eq(2).find('li.selected').text();
    let inspTypeCode = $('.hide-list').eq(3).find('li.selected').text();
    let mbrName = $('.hide-list').eq(4).find('li.selected').text();

    gridApi.setGridOption("rowData", defaultRowData); // 데이터 설정
}
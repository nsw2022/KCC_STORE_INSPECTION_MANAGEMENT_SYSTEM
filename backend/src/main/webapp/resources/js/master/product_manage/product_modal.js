$(function () {
    const input = document.querySelector('#price');
    input.addEventListener('keyup', function(e) {
        let value = e.target.value;
        value = Number(value.replaceAll(',', ''));
        if(isNaN(value)) {         //NaN인지 판별
            input.value = 0;
        }else {                   //NaN이 아닌 경우
            const formatValue = value.toLocaleString('ko-KR');
            input.value = formatValue;
        }
    })
    $('#submit').click(function () {
        let pdtId = $('input[type="hidden"]').val();
        let pdtName = $('#productName').val();
        let brandName = $('#brandName').text();
        let expiration = $('#expiration').val();
        let price = $('#price').val();
        price = Number(price.replaceAll(',', ''))
        let pdtStts = $('input[name="pdtSellSttsCd"]:checked').val();

        if(pdtName === '') {
            pdtName = null;
        }

        if(brandName ==='') {
            brandName = null;
        }

        if(expiration ===0 || expiration === '') {
            expiration = null;
        }

        if (price ===0 || price ==='') {
            price = null;
        }

        if(pdtStts ==='undefined') {
            pdtStts = null;
        }

        let productRequest = {
            brandNm : brandName,
            pdtNm : pdtName,
            pdtPrice : price,
            expDaynum : expiration,
            pdtSellSttsNm : pdtStts
        }


        if(pdtId === '') {
            $.ajax({
                url : '/master/product/save',
                method : 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                data : JSON.stringify(productRequest),
                success : function () {
                    Swal.fire({
                        title: "등록 완료!",
                        text: "완료되었습니다.",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.href = "/master/product/manage";
                        }
                    });
                }, error: function(xhr) {
                    // 응답 상태 코드에 따른 에러 처리
                    if (xhr.status === 403) {
                        Swal.fire("실패!", "권한이 없습니다.", "error");
                    } else if(xhr.status === 400) {
                        Swal.fire("실패", "저장에 실패했습니다", "error");
                    }
                }

            })
        } else {
            if(pdtName === null) {
                pdtName =$('#productName').attr('placeholder');
            }
            if(price === null) {
                price = parseInt($('#price').attr('placeholder').replace(/,/g, ''));
            }
            if(expiration === null) {
                expiration = $('#expiration').attr('placeholder');
            }

            productRequest = {
                brandNm : brandName,
                pdtNm : pdtName,
                pdtPrice : price,
                expDaynum : expiration,
                pdtSellSttsNm : pdtStts
            }
            $.ajax({
                url: `/master/product/update/${pdtId}`,
                method : 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                data : JSON.stringify(productRequest),
                success : function () {
                    Swal.fire({
                        title: "수정 완료!",
                        text: "완료되었습니다.",
                        icon: "success",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.href = "/master/product/manage";
                        }
                    });
                }, error: function(xhr) {
                    console.log(productRequest)
                    // 응답 상태 코드에 따른 에러 처리
                    if (xhr.status === 403) {
                        Swal.fire("실패!", "권한이 없습니다.", "error");
                    } else if(xhr.status === 400) {
                        Swal.fire("실패", "저장에 실패했습니다", "error");
                    }
                }
            })
        }

    })
})



// 구글 시트 CSV URL
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQF.../pub?output=csv';

// CSV 데이터를 가져와서 테이블에 표시하는 함수
function loadOrderData() {
    fetch(csvUrl)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const tableBody = document.querySelector('#orderTable tbody');
            const dateSummary = {};

            rows.forEach((row, index) => {
                if (index === 0) return; // 첫 번째 행은 헤더이므로 건너뛰기

                const columns = row.split(',');

                // 테이블에 행 추가
                const tr = document.createElement('tr');
                columns.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = col.trim();
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);

                // 날짜별 상품별 요약 계산
                const orderDate = columns[7].trim();  // 주문일시
                const productCode = columns[1].trim(); // 상품코드

                if (!dateSummary[orderDate]) {
                    dateSummary[orderDate] = {};
                }

                if (!dateSummary[orderDate][productCode]) {
                    dateSummary[orderDate][productCode] = 0;
                }

                dateSummary[orderDate][productCode]++;
            });

            // 날짜별 상품별 요약 표시
            const dateSummaryDiv = document.querySelector('#dateSummary');
            for (const date in dateSummary) {
                const dateDiv = document.createElement('div');
                dateDiv.textContent = `${date}:`;

                for (const productCode in dateSummary[date]) {
                    const productCount = dateSummary[date][productCode];
                    const productDiv = document.createElement('div');
                    productDiv.textContent = `상품 코드 ${productCode}: ${productCount}개 주문`;
                    dateDiv.appendChild(productDiv);
                }

                dateSummaryDiv.appendChild(dateDiv);
            }
        })
        .catch(error => {
            console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
        });
}

// 페이지 로드 시 데이터 불러오기
window.onload = loadOrderData;

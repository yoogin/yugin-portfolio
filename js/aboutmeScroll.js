const aboutme = document.querySelector('.aboutme');

aboutme.addEventListener('wheel', (e) => {
  e.preventDefault(); // 기본 세로 스크롤 막기
  aboutme.scrollLeft += e.deltaY; // 세로 스크롤을 가로로 변환
});
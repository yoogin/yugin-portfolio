window.addEventListener('DOMContentLoaded', () => {
  const menuLinks = document.querySelectorAll(".menu");
  const headerHeight = (document.querySelector("header")?.offsetHeight) || 0;

  const onScroll = () => {
    let current = "";
    const scrollPos = window.pageYOffset;

    // About 그룹
    const aboutSections = document.querySelectorAll(".aboutMe, .aboutMe02, .aboutMe03, .strongPoint");
    aboutSections.forEach(section => {
      if (scrollPos >= section.offsetTop - headerHeight &&
          scrollPos < section.offsetTop + section.clientHeight - headerHeight) {
        current = "about";
      }
    });

    // Project 그룹
    const projectSections = document.querySelectorAll(".workIntro, .work1, .work2, .work3");
    projectSections.forEach(section => {
      if (scrollPos >= section.offsetTop - headerHeight &&
          scrollPos < section.offsetTop + section.clientHeight - headerHeight) {
        current = "project";
      }
    });

    // Coding 그룹
    const codingSections = document.querySelectorAll(".clone, .cloneIntro");
    codingSections.forEach(section => {
      if (scrollPos >= section.offsetTop - headerHeight &&
          scrollPos < section.offsetTop + section.clientHeight - headerHeight) {
        current = "coding";
      }
    });

    // main(.main)이나 contact(.contact)에서는 active 제거
    const main = document.querySelector(".main");
    const contact = document.querySelector(".contact");
    if ((main && scrollPos < main.offsetTop + main.clientHeight - headerHeight) ||
        (contact && scrollPos >= contact.offsetTop - headerHeight)) {
      current = "";
    }

    // 메뉴 active 적용
    menuLinks.forEach(link => link.classList.remove("active"));
    if (current) {
      const activeLink = document.querySelector(`.${current}Link`);
      if (activeLink) activeLink.classList.add("active");
    }
  };

  window.addEventListener("scroll", onScroll);
  // 초기 로드 시 상태 반영
  onScroll();

  // 메뉴 클릭 시 부드럽게 스크롤
  menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;

      window.scrollTo({
        top: target.offsetTop - headerHeight,
        behavior: "smooth"
      });
    });
  });
});

// GSAP 애니메이션은 모든 리소스 로딩 이후 실행 (CDN 로딩 보장)
window.addEventListener('load', () => {
  if (!window.gsap) return;
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 성능 최적화: 페인트 힌트
  gsap.set([".cloneIntro .img", ".cloneIntro .textBox", ".cloneIntro .stic"], {
    willChange: "transform, opacity"
  });

  // 1️⃣ 노란 배경 이미지 먼저 등장 (아래로 스크롤할 때마다 재생)
  gsap.fromTo(
    ".cloneIntro .img",
    { y: -120, autoAlpha: 0, force3D: true },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: ".cloneIntro",
        start: "top 85%",
        toggleActions: "play none none reset",
      }
    }
  );

  // 2️⃣ 나머지 요소 순차적으로 등장 (아래로 스크롤할 때마다 재생)
  gsap.fromTo(
    ".cloneIntro .textBox, .cloneIntro .stic",
    { y: 60, autoAlpha: 0, force3D: true },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
      immediateRender: false,
      scrollTrigger: {
        trigger: ".cloneIntro",
        start: "top 70%",
        toggleActions: "play none none reset",
      }
    }
  );

  // ── Coding 섹션: 이미지 → 선 그리기 순차 애니 (섹션별 타임라인)
  gsap.utils.toArray(".coding").forEach(coding => {
    const img = coding.querySelector(".img");
    const paths = coding.querySelectorAll(".line path");

    // path 초기화 (선 숨김)
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: coding,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 0.5
      }
    });

    // 1) 이미지 등장
    if (img) {
      tl.from(img, {
        autoAlpha: 0,
        y: 40,
        duration: 0.6,
        ease: "power2.out",
        immediateRender: false
      });
    }

    // 2) 선 그리기 (여러 path면 순차로)
    if (paths.length) {
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "none",
        stagger: { each: 0.05 }
      }, ">-0.1");
    }
  });
});




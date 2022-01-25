'use strict';

//스크롤, 투명 메뉴 -> 색깔 메뉴로 변경
const navbar = document.querySelector('#navbar'); //id가 navbar인 것을 찾는다.
const navbarHeight = navbar.getBoundingClientRect().height; //뷰포트를 기준으로 요소의 세로 크기를 반환
document.addEventListener('scroll', () => {
    if(window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark');
    } else {
        navbar.classList.remove('navbar--dark');
    }
});

//스크롤, home이 점점 투명하게 변함
const home = document.querySelector('.home__container');
const homeHeight = home.getBoundingClientRect().height;

document.addEventListener('scroll', () => {
    home.style.opacity = 1 - window.scrollY / homeHeight; //window.scrollY: 0-4144, homeHeight: 550
});

//스크롤, ↑ 모양 표시
const arrowUp = document.querySelector('.arrow-up');
document.addEventListener('scroll', () => {
    if(window.scrollY > homeHeight/2) {
        arrowUp.classList.add('visible');
    } else {
        arrowUp.classList.remove('visible');
    }
})

//↑ 클릭, 맨 위로 이동
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home');
});

//상단 메뉴 클릭,  해당 메뉴로 스크롤 자동 이동
const navbarMenu = document.querySelector('.navbar__menu'); 
navbarMenu.addEventListener('click', (e) => { //클릭한 이벤트가 들어옴
    // event.target은 이벤트가 발생한 대상 객체
    const object = e.target;
    // dataset 객체를 통해 data 속성을 가져오기 위해서는 속성 이름의 data- 뒷 부분을 사용
    const attribute = object.dataset.link; //data-link로 이동
    if(attribute == null) {
        return; // 아무것도 하지 않음
    }
    navbarMenu.classList.remove('open');
    scrollIntoView(attribute);
    selectNavItem(target);
    
});

//"contact me" 클릭, home으로 이동
const contact = document.querySelector('.home__contact');
contact.addEventListener('click', () => {
    scrollIntoView('#contact');
});

//토글 버튼 클릭, 메뉴 나타남
const toggleBtn = document.querySelector('.navbar__toggle-btn');
const menu = document.querySelector('.navbar__menu');

toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('open');

});

//Work(project) 애니메이션 효과
const workContainer = document.querySelector('.work__categories');
const projectContainer = document.querySelector('.work__projects');
const projects = document.querySelectorAll('.project'); 

workContainer.addEventListener('click', (e) => {
const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter
    if(filter == null) {
        return; //아무일도 안일어남
    } else {
        const active = document.querySelector('.category__btn.selected');
        active.classList.remove('selected');
        const target = e.target.nodeName === 'BUTTON' ? e.target : e.target.parentNode;
        target.classList.add('selected');

        projectContainer.classList.add('anim-out'); //카테고리 클릭 시 애니메이션 효과

        setTimeout(() => {
                projects.forEach((item) => { //projects에 있는 배열들 하나하나를 item에 받아옴
                if(filter === '*' || filter === item.dataset.type) {
                    item.classList.remove('invisible') //none을 없앰 -> 보여줌
                } else {
                    item.classList.add('invisible') //안보여줌
                }
            });
            projectContainer.classList.remove('anim-out');
        }, 300);
    }
});

//스크롤, 해당 메뉴 표시 

//1. 모든 섹션 요소들과 메뉴 아이템들을 가지고 온다
const sectionIds = ['#home', '#about', '#skills', '#work', '#testimonials', '#contact'];
const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => document.querySelector(`[data-link="${id}"]`));

let selectedNavIndex = 0;
let selectedNavItem = navItems[0];

//2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
const observerOptions = { //observer옵션 만들기
    root: null,
    rootMargin: '0px',
    threshold: 0.6,
}

const observerCallback = (entries, observer) => { //observer 콜백 만들기
    entries.forEach(entry => {
        if(!entry.isIntersecting && entry.intersectionRatio > 0 ) { // 엔트리가 빠져나가고 ratio가 0이상일때
            const index = sectionIds.indexOf(`#${entry.target.id}`);
           
            //y 좌표가 마이너스, 스크롤링이 아래로 / 페이지가 위로
            if(entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1;
            } else {
                selectedNavIndex = index - 1;
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

//스크롤, 처음 / 끝 메뉴 표시
window.addEventListener('wheel', () => {
    if (window.scrollY === 0) { //스크롤 젤 위로 했을 때
        selectedNavIndex = 0;
    } else if (
        window.scrollY + window.innerHeight === document.body.clientHeight) { //스크롤 젤 밑으로 했을 때
        selectedNavIndex = navItems.length - 1;
    }
    selectNavItem(navItems[selectedNavIndex]); //함수 호출
})

//공통함수
function selectNavItem(selected) {
    selectedNavItem.classList.remove('active');
    selectedNavItem = selected;
    selectedNavItem.classList.add('active');
}

function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({behavior: 'smooth'});
    selectNavItem(navItems[sectionIds.indexOf(selector)]);
}

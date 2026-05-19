// One Way Super App - iOS HIG & Onboarding Logic

document.addEventListener('DOMContentLoaded', () => {
    initOnboarding();
    initSOS();
    initHaptics();
});

function initOnboarding() {
    const onboarding = document.getElementById('onboarding-screen');
    const slider = document.getElementById('onboarding-slider');
    const nextBtn = document.getElementById('onboarding-next');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    // Check if onboarding was already seen (Simulation)
    if (localStorage.getItem('one_way_onboarded')) {
        onboarding.classList.add('hidden');
    }

    nextBtn.addEventListener('click', () => {
        if (currentSlide < 2) {
            currentSlide++;
            slider.scrollTo({
                left: slider.clientWidth * currentSlide,
                behavior: 'smooth'
            });
            updateDots(currentSlide);
            if (currentSlide === 2) nextBtn.innerText = "Başla";
        } else {
            onboarding.classList.add('hidden');
            localStorage.setItem('one_way_onboarded', 'true');
        }
        triggerHaptic(15);
    });

    slider.addEventListener('scroll', () => {
        const index = Math.round(slider.scrollLeft / slider.clientWidth);
        if (index !== currentSlide) {
            currentSlide = index;
            updateDots(currentSlide);
            if (currentSlide === 2) nextBtn.innerText = "Başla";
            else nextBtn.innerText = "Növbəti";
        }
    });

    function updateDots(index) {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
}

function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    
    const target = document.getElementById(`screen-${screenId}`);
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    updateNavState(screenId);
    triggerHaptic(15);
}

function updateNavState(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const icon = item.querySelector('i');
        const labelText = item.querySelector('.nav-label').innerText.toLowerCase();
        
        if (icon) {
            icon.classList.remove('ph-fill');
            icon.classList.add('ph');
        }

        if ((screenId === 'home' && labelText.includes('ana')) || 
            (screenId === 'ai' && labelText.includes('ai')) || 
            (screenId === 'wallet' && labelText.includes('pulqabı'))) {
            item.classList.add('active');
            if (icon) {
                icon.classList.remove('ph');
                icon.classList.add('ph-fill');
            }
        }
    });
}

function initSOS() {
    const sosBtn = document.getElementById('sos-trigger');
    if (sosBtn) {
        sosBtn.addEventListener('click', () => {
            triggerHaptic(50);
            if (confirm("SOS TƏHLÜKƏ SİQNALI! Yerli orqanlara məlumat göndərilsin?")) {
                alert("Kömək yoldadır. Sizin yeriniz paylaşıldı.");
            }
        });
    }
}

function initHaptics() {
    const targets = document.querySelectorAll('button, .service-item, .nav-item, .trip-card');
    targets.forEach(t => {
        t.addEventListener('touchstart', () => triggerHaptic(10));
    });
}

function triggerHaptic(duration) {
    if (window.navigator.vibrate) {
        window.navigator.vibrate(duration);
    }
}

// Drawer Menu Logic
function initDrawerMenu() {
    const burgerBtn = document.getElementById('burger-menu-btn');
    const closeBtn = document.getElementById('close-drawer-btn');
    const drawer = document.getElementById('side-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (burgerBtn && drawer && overlay) {
        burgerBtn.addEventListener('click', () => {
            drawer.classList.add('active');
            overlay.classList.add('active');
            triggerHaptic(15);
        });

        const closeDrawer = () => {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            triggerHaptic(10);
        };

        closeBtn.addEventListener('click', closeDrawer);
        overlay.addEventListener('click', closeDrawer);

        // Close drawer when a menu item is clicked
        const listItems = drawer.querySelectorAll('.ios-list-item');
        listItems.forEach(item => {
            item.addEventListener('click', closeDrawer);
        });
    }
}

// Ensure initDrawerMenu is called
document.addEventListener('DOMContentLoaded', () => {
    initDrawerMenu();
});


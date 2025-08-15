// 倒计时功能
class CountdownTimer {
    constructor(targetDate, elementIds) {
        this.targetDate = new Date(targetDate).getTime();
        this.elements = {
            days: document.getElementById(elementIds.days),
            hours: document.getElementById(elementIds.hours),
            minutes: document.getElementById(elementIds.minutes),
            seconds: document.getElementById(elementIds.seconds)
        };
        
        this.start();
    }
    
    start() {
        // 立即更新一次
        this.update();
        
        // 每秒更新
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
    }
    
    update() {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        
        if (distance < 0) {
            this.stop();
            this.showReleased();
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        this.elements.days.textContent = this.formatNumber(days, 3);
        this.elements.hours.textContent = this.formatNumber(hours, 2);
        this.elements.minutes.textContent = this.formatNumber(minutes, 2);
        this.elements.seconds.textContent = this.formatNumber(seconds, 2);
        
        // 添加闪烁效果
        this.addGlowEffect();
    }
    
    formatNumber(num, digits) {
        return num.toString().padStart(digits, '0');
    }
    
    addGlowEffect() {
        // 为秒数添加特殊的闪烁效果
        if (this.elements.seconds) {
            this.elements.seconds.style.textShadow = '0 0 20px #ff6b35, 0 0 30px #ff6b35';
            setTimeout(() => {
                if (this.elements.seconds) {
                    this.elements.seconds.style.textShadow = '0 0 15px #ff6b35';
                }
            }, 100);
        }
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    
    showReleased() {
        const countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <h2 class="countdown-title">🎉 游戏已正式发售！🎉</h2>
                <div class="released-message">
                    <p>Battlefield 6 现已在各大平台正式发售</p>
                    <a href="https://store.steampowered.com/app/2807960/" target="_blank" class="buy-now-btn">
                        立即购买
                    </a>
                </div>
            `;
        }
    }
}

// 页面加载完成后初始化倒计时
document.addEventListener('DOMContentLoaded', function() {
    // Battlefield 6 发售日期：2025年10月10日
    const releaseDate = '2025-10-10T00:00:00';
    
    new CountdownTimer(releaseDate, {
        days: 'days',
        hours: 'hours',
        minutes: 'minutes',
        seconds: 'seconds'
    });
    
    // 添加页面加载动画
    animateCountdownOnLoad();
});

// 页面加载动画
function animateCountdownOnLoad() {
    const timeUnits = document.querySelectorAll('.time-unit');
    
    timeUnits.forEach((unit, index) => {
        unit.style.opacity = '0';
        unit.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            unit.style.transition = 'all 0.6s ease';
            unit.style.opacity = '1';
            unit.style.transform = 'translateY(0)';
        }, index * 200);
    });
}
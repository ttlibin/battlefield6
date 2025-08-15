// 服务器详情页面功能
class ServerDetailsPage {
    constructor() {
        this.serverData = {};
        this.chart = null;
        this.init();
    }

    init() {
        this.loadServerDetails();
        this.setupChart();
        this.updateOverviewStats();
        this.startAutoUpdate();
    }

    // 加载详细服务器信息
    async loadServerDetails() {
        const serverList = document.getElementById('serverList');
        if (!serverList) return;

        // 模拟详细服务器数据
        const detailedServers = [
            {
                region: 'asia',
                name: '亚洲服务器',
                location: '新加坡',
                ip: '103.28.54.123',
                players: 15234,
                maxPlayers: 20000,
                ping: 28,
                uptime: '99.8%',
                maps: ['Orbital', 'Manifest', 'Discarded'],
                gameMode: 'Conquest',
                status: 'online'
            },
            {
                region: 'europe',
                name: '欧洲服务器',
                location: '法兰克福',
                ip: '185.60.112.45',
                players: 12456,
                maxPlayers: 18000,
                ping: 42,
                uptime: '99.5%',
                maps: ['Breakaway', 'Hourglass', 'Kaleidoscope'],
                gameMode: 'Breakthrough',
                status: 'online'
            },
            {
                region: 'america',
                name: '美洲服务器',
                location: '弗吉尼亚',
                ip: '54.236.78.91',
                players: 18123,
                maxPlayers: 22000,
                ping: 35,
                uptime: '99.9%',
                maps: ['Renewal', 'Exposure', 'Stranded'],
                gameMode: 'Hazard Zone',
                status: 'online'
            }
        ];

        const serverHTML = detailedServers.map(server => this.createServerDetailCard(server)).join('');
        serverList.innerHTML = serverHTML;

        // 添加进入动画
        this.animateServerCards();
    }

    // 创建详细服务器卡片
    createServerDetailCard(server) {
        const playerPercentage = Math.round((server.players / server.maxPlayers) * 100);
        
        return `
            <div class="server-detail-card" data-region="${server.region}">
                <div class="server-header">
                    <div class="server-info">
                        <h4 class="server-name">${server.name}</h4>
                        <p class="server-location">${server.location}</p>
                    </div>
                    <div class="server-status-indicator ${server.status}"></div>
                </div>
                
                <div class="server-stats">
                    <div class="stat-row">
                        <span class="stat-label">在线人数:</span>
                        <span class="stat-value">${server.players.toLocaleString()} / ${server.maxPlayers.toLocaleString()}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">延迟:</span>
                        <span class="stat-value">${server.ping}ms</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">正常运行时间:</span>
                        <span class="stat-value">${server.uptime}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">IP地址:</span>
                        <span class="stat-value">${server.ip}</span>
                    </div>
                </div>

                <div class="player-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${playerPercentage}%"></div>
                    </div>
                    <span class="progress-text">${playerPercentage}% 满员</span>
                </div>

                <div class="server-maps">
                    <h5>当前地图轮换:</h5>
                    <div class="map-list">
                        ${server.maps.map(map => `<span class="map-tag">${map}</span>`).join('')}
                    </div>
                </div>

                <div class="server-actions">
                    <button class="action-btn primary" onclick="serverDetailsPage.joinServer('${server.region}')">
                        加入服务器
                    </button>
                    <button class="action-btn secondary" onclick="serverDetailsPage.refreshServer('${server.region}')">
                        刷新状态
                    </button>
                </div>
            </div>
        `;
    }

    // 服务器卡片动画
    animateServerCards() {
        const cards = document.querySelectorAll('.server-detail-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, index * 200);
        });
    }

    // 更新概览统计
    updateOverviewStats() {
        // 从全局服务器监控获取数据
        if (window.serverMonitor) {
            const stats = window.serverMonitor.getServerStats();
            
            document.getElementById('totalPlayers').textContent = stats.totalPlayers.toLocaleString();
            document.getElementById('onlineServers').textContent = `${stats.onlineServers}/${stats.totalServers}`;
            document.getElementById('avgPing').textContent = `${stats.avgPing}ms`;
        }
    }

    // 设置图表
    setupChart() {
        const canvas = document.getElementById('serverChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // 模拟历史数据
        const hours = [];
        const playerData = [];
        
        for (let i = 23; i >= 0; i--) {
            const hour = new Date();
            hour.setHours(hour.getHours() - i);
            hours.push(hour.getHours() + ':00');
            
            // 模拟玩家数量变化
            const baseCount = 45000;
            const timeVariation = Math.sin((23 - i) * Math.PI / 12) * 10000;
            const randomVariation = (Math.random() - 0.5) * 5000;
            playerData.push(Math.floor(baseCount + timeVariation + randomVariation));
        }

        this.drawChart(ctx, hours, playerData);
    }

    // 绘制简单图表
    drawChart(ctx, labels, data) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 设置样式
        ctx.fillStyle = '#f0f6fc';
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 2;
        
        // 计算数据范围
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue;
        
        // 绘制网格线
        ctx.strokeStyle = '#30363d';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (height - 2 * padding) * i / 5;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // 绘制数据线
        ctx.strokeStyle = '#ff6b35';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (width - 2 * padding) * index / (data.length - 1);
            const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // 绘制数据点
        ctx.fillStyle = '#ff6b35';
        data.forEach((value, index) => {
            const x = padding + (width - 2 * padding) * index / (data.length - 1);
            const y = height - padding - ((value - minValue) / range) * (height - 2 * padding);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // 绘制标签
        ctx.fillStyle = '#8b949e';
        ctx.font = '12px Roboto';
        ctx.textAlign = 'center';
        
        // X轴标签（每4小时显示一个）
        labels.forEach((label, index) => {
            if (index % 4 === 0) {
                const x = padding + (width - 2 * padding) * index / (labels.length - 1);
                ctx.fillText(label, x, height - padding + 20);
            }
        });
        
        // Y轴标签
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (range * i / 5);
            const y = height - padding - (height - 2 * padding) * i / 5;
            ctx.fillText(Math.round(value).toLocaleString(), padding - 10, y + 4);
        }
        
        // 图表标题
        ctx.fillStyle = '#f0f6fc';
        ctx.font = '16px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('24小时玩家数量变化', width / 2, 30);
    }

    // 加入服务器
    joinServer(region) {
        // 模拟加入服务器
        alert(`正在连接到${region}服务器...`);
    }

    // 刷新单个服务器
    async refreshServer(region) {
        const card = document.querySelector(`[data-region="${region}"]`);
        if (card) {
            card.style.opacity = '0.7';
            
            // 模拟刷新延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            card.style.opacity = '1';
            
            // 这里可以重新加载该服务器的数据
            console.log(`已刷新${region}服务器状态`);
        }
    }

    // 开始自动更新
    startAutoUpdate() {
        setInterval(() => {
            this.updateOverviewStats();
        }, 30000); // 30秒更新一次
    }
}

// 全局实例
let serverDetailsPage;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    serverDetailsPage = new ServerDetailsPage();
});

// 导出给其他模块使用
window.ServerDetailsPage = ServerDetailsPage;
// 服务器状态监控系统
class ServerMonitor {
    constructor() {
        this.servers = {
            asia: {
                name: 'Asia',
                endpoint: 'asia.battlefield6.xyz',
                players: 0,
                ping: 0,
                status: 'online'
            },
            europe: {
                name: 'Europe',
                endpoint: 'europe.battlefield6.xyz',
                players: 0,
                ping: 0,
                status: 'online'
            },
            america: {
                name: 'America',
                endpoint: 'america.battlefield6.xyz',
                players: 0,
                ping: 0,
                status: 'online'
            }
        };

        this.updateInterval = null;
        this.init();
    }

    init() {
        this.updateServerStatus();
        this.startAutoUpdate();
        this.setupEventListeners();
    }

    // 混合方案：优先使用真实数据，备用模拟数据
    async fetchServerData(serverKey) {
        try {
            // 优先级1: 从GitHub Actions生成的JSON文件加载
            const realData = await this.loadRealServerData(serverKey);
            if (realData) {
                console.log(`✅ 使用真实服务器数据: ${serverKey}`);
                return realData;
            }

            // 优先级2: 使用Steam API (如果配置了)
            const steamResponse = await this.fetchSteamData(serverKey);
            if (steamResponse) {
                console.log(`✅ 使用Steam API数据: ${serverKey}`);
                return steamResponse;
            }
            
            // 优先级3: 使用智能估算数据
            const estimatedData = this.generateSmartEstimate(serverKey);
            console.log(`⚠️ 使用智能估算数据: ${serverKey}`);
            return estimatedData;
            
        } catch (error) {
            console.error(`获取${serverKey}服务器数据失败:`, error);
            return this.getDefaultServerData(serverKey);
        }
    }

    // 加载真实服务器数据
    async loadRealServerData(serverKey) {
        try {
            const response = await fetch('./data/servers.json');
            if (response.ok) {
                const data = await response.json();
                if (data.regions && data.regions[serverKey]) {
                    return {
                        players: data.regions[serverKey],
                        ping: data.ping ? data.ping[serverKey] : this.estimatePing(serverKey),
                        status: data.status ? data.status[serverKey] : 'online',
                        source: 'real-data',
                        timestamp: Date.now()
                    };
                }
            }
        } catch (error) {
            console.error('加载真实服务器数据失败:', error);
        }
        return null;
    }

    // 生成智能估算数据（基于时区和时间）
    generateSmartEstimate(serverKey) {
        const hour = new Date().getUTCHours();
        const baseData = {
            asia: { basePlayers: 16000, basePing: 25, peakHours: [0, 1, 2, 3, 4, 5, 6, 7] },
            europe: { basePlayers: 14000, basePing: 45, peakHours: [8, 9, 10, 11, 12, 13, 14, 15] },
            america: { basePlayers: 16000, basePing: 35, peakHours: [16, 17, 18, 19, 20, 21, 22, 23] }
        };

        const regionData = baseData[serverKey];
        if (!regionData) return this.getDefaultServerData(serverKey);

        // 判断是否为该地区的高峰时间
        const isPeakTime = regionData.peakHours.includes(hour);
        const peakMultiplier = isPeakTime ? 1.3 : 0.7;
        
        // 添加随机波动
        const randomVariation = 0.8 + (Math.random() * 0.4); // 0.8-1.2倍
        
        const players = Math.floor(regionData.basePlayers * peakMultiplier * randomVariation);
        const ping = regionData.basePing + Math.floor(Math.random() * 20) - 10; // ±10ms变化

        return {
            players: players,
            ping: Math.max(ping, 10), // 最小10ms
            status: 'online',
            source: 'smart-estimate',
            timestamp: Date.now()
        };
    }

    // 估算延迟
    estimatePing(serverKey) {
        const basePing = { asia: 25, europe: 45, america: 35 };
        const variation = Math.floor(Math.random() * 20) - 10; // ±10ms变化
        return Math.max(basePing[serverKey] + variation, 10);
    }

    // Steam API数据获取
    async fetchSteamData(serverKey) {
        try {
            // Steam Web API需要API Key
            const steamApiKey = 'YOUR_STEAM_API_KEY'; // 需要在Steam开发者页面获取
            const appId = '2807960'; // Battlefield 6的Steam App ID

            const response = await fetch(`https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}&key=${steamApiKey}`);
            const data = await response.json();

            if (data.response && data.response.player_count) {
                const totalPlayers = data.response.player_count;

                // 根据地区分配玩家数量（估算）
                const regionDistribution = {
                    asia: 0.35,    // 35%
                    europe: 0.30,  // 30%
                    america: 0.35  // 35%
                };

                const players = Math.floor(totalPlayers * regionDistribution[serverKey]);

                return {
                    players: players,
                    ping: await this.measurePing(serverKey),
                    status: players > 100 ? 'online' : 'maintenance'
                };
            }
        } catch (error) {
            console.error('Steam API调用失败:', error);
        }
        return null;
    }

    // Battlelog API数据获取（EA官方API）
    async fetchBattlelogData(serverKey) {
        try {
            // 注意: EA的Battlelog API可能需要特殊权限
            const regionEndpoints = {
                asia: 'https://battlelog.battlefield.com/bf4/servers/pc/asia/',
                europe: 'https://battlelog.battlefield.com/bf4/servers/pc/europe/',
                america: 'https://battlelog.battlefield.com/bf4/servers/pc/america/'
            };

            const response = await fetch(regionEndpoints[serverKey], {
                headers: {
                    'User-Agent': 'Battlefield6.xyz/1.0',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                // 解析Battlelog响应数据
                return this.parseBattlelogData(data, serverKey);
            }
        } catch (error) {
            console.error('Battlelog API调用失败:', error);
        }
        return null;
    }

    // 第三方游戏服务器API
    async fetchThirdPartyData(serverKey) {
        try {
            // 使用GameTracker或类似服务
            const apiEndpoints = {
                asia: 'https://api.gametracker.com/server_info/battlefield6_asia',
                europe: 'https://api.gametracker.com/server_info/battlefield6_europe',
                america: 'https://api.gametracker.com/server_info/battlefield6_america'
            };

            const response = await fetch(apiEndpoints[serverKey], {
                headers: {
                    'Authorization': 'Bearer YOUR_GAMETRACKER_API_KEY',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    players: data.current_players || 0,
                    ping: data.average_ping || 0,
                    status: data.server_status || 'unknown'
                };
            }
        } catch (error) {
            console.error('第三方API调用失败:', error);
        }
        return null;
    }

    // 测量延迟
    async measurePing(serverKey) {
        const pingEndpoints = {
            asia: 'https://asia.battlefield6.xyz/ping',
            europe: 'https://europe.battlefield6.xyz/ping',
            america: 'https://america.battlefield6.xyz/ping'
        };

        try {
            const startTime = Date.now();
            const response = await fetch(pingEndpoints[serverKey], {
                method: 'HEAD',
                mode: 'no-cors'
            });
            const endTime = Date.now();
            return endTime - startTime;
        } catch (error) {
            // 如果无法测量，返回估算值
            const estimatedPing = {
                asia: 25,
                europe: 45,
                america: 35
            };
            return estimatedPing[serverKey] || 50;
        }
    }

    // 解析Battlelog数据
    parseBattlelogData(data, serverKey) {
        try {
            // 根据Battlelog API响应格式解析数据
            if (data.servers && data.servers.length > 0) {
                const serverData = data.servers[0]; // 取第一个服务器数据
                return {
                    players: serverData.slots.current || 0,
                    ping: serverData.ping || 0,
                    status: serverData.online ? 'online' : 'offline'
                };
            }
        } catch (error) {
            console.error('解析Battlelog数据失败:', error);
        }
        return null;
    }

    // 默认服务器数据（备用方案）
    getDefaultServerData(serverKey) {
        const defaultData = {
            asia: { players: 15000, ping: 25, status: 'online' },
            europe: { players: 12000, ping: 45, status: 'online' },
            america: { players: 18000, ping: 35, status: 'online' }
        };
        return defaultData[serverKey] || { players: 0, ping: 0, status: 'offline' };
    }

    // 更新服务器状态
    async updateServerStatus() {
        const promises = Object.keys(this.servers).map(async (serverKey) => {
            try {
                const data = await this.fetchServerData(serverKey);
                this.servers[serverKey] = { ...this.servers[serverKey], ...data };
                this.updateServerUI(serverKey, data);
            } catch (error) {
                console.error(`Failed to update ${serverKey} server:`, error);
                this.servers[serverKey].status = 'offline';
                this.updateServerUI(serverKey, { status: 'offline', players: 0, ping: 0 });
            }
        });

        await Promise.all(promises);
    }

    // 更新服务器UI显示
    updateServerUI(serverKey, data) {
        const playersElement = document.getElementById(`${serverKey}Players`);
        const pingElement = document.getElementById(`${serverKey}Ping`);
        const statusElement = document.querySelector(`.server-card:nth-child(${this.getServerIndex(serverKey)}) .server-status`);

        if (playersElement) {
            // 添加数字动画效果
            this.animateNumber(playersElement, parseInt(playersElement.textContent.replace(/,/g, '')) || 0, data.players);
        }

        if (pingElement) {
            this.animateNumber(pingElement, parseInt(pingElement.textContent) || 0, data.ping);
        }

        if (statusElement) {
            statusElement.className = `server-status ${data.status}`;

            // 添加状态变化动画
            statusElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                statusElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // 数字动画效果
    animateNumber(element, from, to) {
        const duration = 1000; // 1秒动画
        const startTime = Date.now();
        const difference = to - from;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用缓动函数
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(from + difference * easeProgress);

            if (element.id.includes('Players')) {
                element.textContent = current.toLocaleString();
            } else {
                element.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // 获取服务器在UI中的索引
    getServerIndex(serverKey) {
        const indexMap = { asia: 1, europe: 2, america: 3 };
        return indexMap[serverKey] || 1;
    }

    // 开始自动更新
    startAutoUpdate() {
        // 每30秒更新一次
        this.updateInterval = setInterval(() => {
            this.updateServerStatus();
        }, 30000);
    }

    // 停止自动更新
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 页面可见性变化时的处理
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoUpdate();
            } else {
                this.updateServerStatus();
                this.startAutoUpdate();
            }
        });

        // 语言切换时更新服务器名称
        window.addEventListener('languageChanged', () => {
            this.updateServerNames();
        });

        // 点击服务器卡片时手动刷新
        document.querySelectorAll('.server-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                const serverKeys = ['asia', 'europe', 'america'];
                const serverKey = serverKeys[index];
                if (serverKey) {
                    this.refreshSingleServer(serverKey);
                }
            });
        });
    }

    // 刷新单个服务器状态
    async refreshSingleServer(serverKey) {
        const card = document.querySelector(`.server-card:nth-child(${this.getServerIndex(serverKey)})`);
        if (card) {
            card.style.opacity = '0.7';
            card.style.transform = 'scale(0.98)';
        }

        try {
            const data = await this.fetchServerData(serverKey);
            this.servers[serverKey] = { ...this.servers[serverKey], ...data };
            this.updateServerUI(serverKey, data);
        } catch (error) {
            console.error(`Failed to refresh ${serverKey} server:`, error);
        } finally {
            if (card) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }
        }
    }

    // 更新服务器名称（多语言支持）
    updateServerNames() {
        // 这个方法会在语言切换时被调用
        // 服务器名称通过HTML的data-i18n属性自动更新
    }

    // 获取服务器统计信息
    getServerStats() {
        const totalPlayers = Object.values(this.servers).reduce((sum, server) => sum + server.players, 0);
        const onlineServers = Object.values(this.servers).filter(server => server.status === 'online').length;
        const avgPing = Math.floor(Object.values(this.servers).reduce((sum, server) => sum + server.ping, 0) / Object.keys(this.servers).length);

        return {
            totalPlayers,
            onlineServers,
            totalServers: Object.keys(this.servers).length,
            avgPing
        };
    }

    // 添加服务器状态历史记录（可选功能）
    logServerStatus() {
        const timestamp = new Date().toISOString();
        const stats = this.getServerStats();

        // 存储到localStorage（简单的历史记录）
        const history = JSON.parse(localStorage.getItem('bf6-server-history') || '[]');
        history.push({ timestamp, ...stats });

        // 只保留最近24小时的数据
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const filteredHistory = history.filter(entry => new Date(entry.timestamp).getTime() > oneDayAgo);

        localStorage.setItem('bf6-server-history', JSON.stringify(filteredHistory));
    }
}

// 全局实例
let serverMonitor;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    serverMonitor = new ServerMonitor();

    // 每5分钟记录一次服务器状态
    setInterval(() => {
        if (serverMonitor) {
            serverMonitor.logServerStatus();
        }
    }, 5 * 60 * 1000);
});

// 导出给其他模块使用
window.ServerMonitor = ServerMonitor;
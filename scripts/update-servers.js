// 混合方案服务器数据更新脚本
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class HybridServerUpdater {
    constructor() {
        this.steamApiKey = process.env.STEAM_API_KEY;
        this.appId = '2807960'; // Battlefield 6的Steam App ID
        this.serverData = {
            timestamp: new Date().toISOString(),
            totalPlayers: 0,
            regions: {
                asia: 0,
                europe: 0,
                america: 0
            },
            status: {
                asia: 'online',
                europe: 'online', 
                america: 'online'
            },
            ping: {
                asia: 25,
                europe: 45,
                america: 35
            }
        };
    }

    async updateServerData() {
        console.log('🚀 开始混合方案服务器数据更新...');
        
        try {
            // 优先级1: Steam API获取真实数据
            const steamSuccess = await this.fetchSteamData();
            
            // 优先级2: 如果Steam失败，使用估算数据
            if (!steamSuccess) {
                console.log('⚠️  Steam API失败，使用估算数据');
                this.generateEstimatedData();
            }
            
            // 优先级3: 测量延迟数据
            await this.measureRegionPings();
            
            // 保存数据
            this.saveServerData();
            
            console.log('✅ 服务器数据更新完成！');
        } catch (error) {
            console.error('❌ 更新服务器数据时出错:', error);
            // 使用备用数据
            this.generateFallbackData();
            this.saveServerData();
        }
    }

    // Steam API数据获取
    async fetchSteamData() {
        if (!this.steamApiKey) {
            console.log('⚠️  Steam API Key未配置，跳过Steam数据获取');
            return false;
        }

        try {
            console.log('📊 从Steam API获取玩家数据...');
            
            const response = await axios.get('https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/', {
                params: {
                    appid: this.appId,
                    key: this.steamApiKey
                },
                timeout: 10000
            });
            
            if (response.data.response && response.data.response.player_count) {
                const totalPlayers = response.data.response.player_count;
                console.log(`✓ Steam API: ${totalPlayers} 总在线玩家`);
                
                // 根据时区分配玩家数量
                const distribution = this.getTimeBasedDistribution();
                
                this.serverData.totalPlayers = totalPlayers;
                this.serverData.regions.asia = Math.floor(totalPlayers * distribution.asia);
                this.serverData.regions.europe = Math.floor(totalPlayers * distribution.europe);
                this.serverData.regions.america = Math.floor(totalPlayers * distribution.america);
                
                console.log(`  亚洲: ${this.serverData.regions.asia}`);
                console.log(`  欧洲: ${this.serverData.regions.europe}`);
                console.log(`  美洲: ${this.serverData.regions.america}`);
                
                return true;
            }
        } catch (error) {
            console.error('❌ Steam API调用失败:', error.message);
        }
        
        return false;
    }

    // 基于时区的玩家分布
    getTimeBasedDistribution() {
        const hour = new Date().getUTCHours();
        
        // 根据UTC时间调整地区活跃度
        if (hour >= 0 && hour < 8) {
            // 亚洲时间段 (UTC 0-8 = 亚洲 8-16点)
            return { asia: 0.50, europe: 0.25, america: 0.25 };
        } else if (hour >= 8 && hour < 16) {
            // 欧洲时间段 (UTC 8-16 = 欧洲 8-16点)
            return { asia: 0.25, europe: 0.50, america: 0.25 };
        } else {
            // 美洲时间段 (UTC 16-24 = 美洲 8-16点)
            return { asia: 0.25, europe: 0.25, america: 0.50 };
        }
    }

    // 生成估算数据
    generateEstimatedData() {
        console.log('📈 生成基于时间的估算数据...');
        
        // 基础玩家数量（模拟真实游戏的玩家波动）
        const baseTotal = 45000;
        const hour = new Date().getUTCHours();
        
        // 基于时间的波动 (正弦波模拟日常活跃度)
        const timeVariation = Math.sin((hour * Math.PI) / 12) * 0.3;
        const randomVariation = (Math.random() - 0.5) * 0.2;
        
        const totalPlayers = Math.floor(baseTotal * (1 + timeVariation + randomVariation));
        const distribution = this.getTimeBasedDistribution();
        
        this.serverData.totalPlayers = totalPlayers;
        this.serverData.regions.asia = Math.floor(totalPlayers * distribution.asia);
        this.serverData.regions.europe = Math.floor(totalPlayers * distribution.europe);
        this.serverData.regions.america = Math.floor(totalPlayers * distribution.america);
        
        console.log(`✓ 估算数据: ${totalPlayers} 总玩家`);
        console.log(`  亚洲: ${this.serverData.regions.asia}`);
        console.log(`  欧洲: ${this.serverData.regions.europe}`);
        console.log(`  美洲: ${this.serverData.regions.america}`);
    }

    // 测量地区延迟
    async measureRegionPings() {
        console.log('🌐 测量地区延迟...');
        
        const pingTargets = {
            asia: 'https://www.google.com.sg',     // 新加坡
            europe: 'https://www.google.de',      // 德国
            america: 'https://www.google.com'     // 美国
        };
        
        for (const [region, url] of Object.entries(pingTargets)) {
            try {
                const startTime = Date.now();
                
                await axios.head(url, {
                    timeout: 5000,
                    headers: {
                        'User-Agent': 'Battlefield6.xyz/1.0'
                    }
                });
                
                const endTime = Date.now();
                const ping = Math.min(endTime - startTime, 200); // 限制最大显示延迟
                
                this.serverData.ping[region] = ping;
                console.log(`  ${region}: ${ping}ms`);
                
            } catch (error) {
                // 使用估算延迟
                const estimatedPing = {
                    asia: 25 + Math.floor(Math.random() * 20),
                    europe: 45 + Math.floor(Math.random() * 20),
                    america: 35 + Math.floor(Math.random() * 20)
                };
                
                this.serverData.ping[region] = estimatedPing[region];
                console.log(`  ${region}: ${estimatedPing[region]}ms (估算)`);
            }
        }
    }

    // 生成备用数据
    generateFallbackData() {
        console.log('📋 生成备用服务器数据...');
        
        const hour = new Date().getHours();
        const distribution = this.getTimeBasedDistribution();
        
        // 备用基础数据
        const baseTotal = 42000;
        const variation = Math.sin(hour * Math.PI / 12) * 0.2;
        const totalPlayers = Math.floor(baseTotal * (1 + variation));
        
        this.serverData = {
            timestamp: new Date().toISOString(),
            totalPlayers: totalPlayers,
            regions: {
                asia: Math.floor(totalPlayers * distribution.asia),
                europe: Math.floor(totalPlayers * distribution.europe),
                america: Math.floor(totalPlayers * distribution.america)
            },
            status: {
                asia: 'online',
                europe: 'online',
                america: 'online'
            },
            ping: {
                asia: 25 + Math.floor(Math.random() * 15),
                europe: 45 + Math.floor(Math.random() * 15),
                america: 35 + Math.floor(Math.random() * 15)
            },
            source: 'fallback'
        };
        
        console.log(`✓ 备用数据: ${totalPlayers} 总玩家`);
    }

    // 保存服务器数据
    saveServerData() {
        const dataDir = path.join(__dirname, '..', 'data');
        
        // 确保data目录存在
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // 保存服务器数据
        const serverFile = path.join(dataDir, 'servers.json');
        fs.writeFileSync(serverFile, JSON.stringify(this.serverData, null, 2));
        
        console.log(`💾 服务器数据已保存到: ${serverFile}`);
        
        // 保存历史数据（用于图表显示）
        this.saveHistoryData();
        
        // 更新统计信息
        const statsFile = path.join(dataDir, 'server-stats.json');
        const stats = {
            lastUpdated: this.serverData.timestamp,
            totalPlayers: this.serverData.totalPlayers,
            onlineServers: 3, // 假设3个地区服务器都在线
            avgPing: Math.round((this.serverData.ping.asia + this.serverData.ping.europe + this.serverData.ping.america) / 3),
            updateMethod: 'hybrid',
            dataSource: this.serverData.source || 'steam'
        };
        fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
        
        console.log(`📊 服务器统计: ${stats.totalPlayers} 玩家, 平均延迟 ${stats.avgPing}ms`);
    }

    // 保存历史数据
    saveHistoryData() {
        const dataDir = path.join(__dirname, '..', 'data');
        const historyFile = path.join(dataDir, 'server-history.json');
        
        let history = [];
        
        // 读取现有历史数据
        if (fs.existsSync(historyFile)) {
            try {
                const historyData = fs.readFileSync(historyFile, 'utf8');
                history = JSON.parse(historyData);
            } catch (error) {
                console.error('读取历史数据失败:', error);
                history = [];
            }
        }
        
        // 添加当前数据点
        const dataPoint = {
            timestamp: this.serverData.timestamp,
            totalPlayers: this.serverData.totalPlayers,
            regions: { ...this.serverData.regions },
            avgPing: Math.round((this.serverData.ping.asia + this.serverData.ping.europe + this.serverData.ping.america) / 3)
        };
        
        history.push(dataPoint);
        
        // 只保留最近24小时的数据 (假设每小时更新一次)
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        history = history.filter(point => new Date(point.timestamp).getTime() > oneDayAgo);
        
        // 保存历史数据
        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
        
        console.log(`📈 历史数据已更新，保留 ${history.length} 个数据点`);
    }
}

// 如果直接运行此脚本
if (require.main === module) {
    const updater = new HybridServerUpdater();
    updater.updateServerData();
}

module.exports = HybridServerUpdater;
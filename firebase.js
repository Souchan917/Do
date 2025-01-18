// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getDatabase, 
    ref, 
    set, 
    push, 
    get, 
    query, 
    orderByChild, 
    limitToLast,
    increment,
    update 
} from "firebase/database";



// Firebaseの初期化
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// プレイ統計管理クラス
class GameStatistics {
    constructor() {
        this.sessionId = Math.random().toString(36).substring(2, 15);
        this.isNewVisitor = true;
        this.hasStartedPlaying = false;
    }

    async initialize() {
        await this.recordVisit();
    }

    async recordVisit() {
        const statsRef = ref(db, 'statistics');
        const updates = {
            totalVisits: increment(1)
        };

        if (this.isNewVisitor) {
            updates.uniqueVisitors = increment(1);
            this.isNewVisitor = false;
        }

        await update(statsRef, updates);
    }

    async recordGameStart() {
        if (!this.hasStartedPlaying) {
            const statsRef = ref(db, 'statistics');
            await update(statsRef, {
                totalPlays: increment(1)
            });
            this.hasStartedPlaying = true;
        }
    }

    async recordClear(clickCount, clearTime) {
        try {
            // クリア記録を保存
            const recordRef = ref(db, 'clearRecords');
            await push(recordRef, {
                sessionId: this.sessionId,
                clickCount: clickCount,
                clearTime: clearTime,
                timestamp: Date.now()
            });

            // 統計情報を更新
            const statsRef = ref(db, 'statistics');
            await update(statsRef, {
                totalClears: increment(1),
                totalClicksAllClears: increment(clickCount)
            });

            console.log('クリア記録保存成功');
        } catch (error) {
            console.error('クリア記録保存エラー:', error);
        }
    }

    async getStatistics() {
        try {
            const statsRef = ref(db, 'statistics');
            const snapshot = await get(statsRef);
            const stats = snapshot.val() || {
                totalVisits: 0,
                uniqueVisitors: 0,
                totalPlays: 0,
                totalClears: 0,
                totalClicksAllClears: 0
            };

            // クリア記録から追加の統計を計算
            const recordsRef = ref(db, 'clearRecords');
            const recordsSnapshot = await get(recordsRef);
            const records = [];
            recordsSnapshot.forEach(childSnapshot => {
                records.push(childSnapshot.val());
            });

            // 最小クリック数を計算
            const minClicks = records.length > 0 
                ? Math.min(...records.map(r => r.clickCount))
                : '-';

            // 平均クリック数を計算
            const avgClicks = records.length > 0
                ? Math.round(stats.totalClicksAllClears / stats.totalClears)
                : '-';

            return {
                totalVisits: stats.totalVisits,
                uniqueVisitors: stats.uniqueVisitors,
                totalPlays: stats.totalPlays,
                totalClears: stats.totalClears,
                bestClickCount: minClicks,
                averageClickCount: avgClicks
            };
        } catch (error) {
            console.error('統計情報取得エラー:', error);
            return null;
        }
    }

    async getTopRecords(limit = 10) {
        try {
            const recordsRef = ref(db, 'clearRecords');
            const recordsQuery = query(
                recordsRef, 
                orderByChild('clickCount'), 
                limitToLast(limit)
            );
            const snapshot = await get(recordsQuery);
            const records = [];
            snapshot.forEach((childSnapshot) => {
                records.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            return records.sort((a, b) => a.clickCount - b.clickCount);
        } catch (error) {
            console.error('記録取得エラー:', error);
            return [];
        }
    }
}

// エクスポート
export const gameStats = new GameStatistics();
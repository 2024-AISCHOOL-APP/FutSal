const sessions = {}; // 메모리 기반 세션 저장소 (개발 및 테스트 용도)

const sessionStore = {
    get: (sessionId, callback) => {
        console.log(`Getting session for ID: ${sessionId}`); // 디버깅용 로그
        if (sessions[sessionId]) {
            callback(null, sessions[sessionId]);
        } else {
            callback(new Error('Session not found'), null);
        }
    },
    set: (sessionId, sessionData, callback) => {
        console.log(`Setting session for ID: ${sessionId}`); // 디버깅용 로그
        sessions[sessionId] = sessionData;
        callback(null);
    }
};

module.exports = sessionStore;
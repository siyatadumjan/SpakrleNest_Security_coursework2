import React, { useState } from 'react';
import { loginUserApi } from '../apis/Api';

// Enhanced Login Component with Debugging
const LoginDebugger = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [debugInfo, setDebugInfo] = useState([]);

    const addDebugInfo = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugInfo(prev => [...prev, { message, type, timestamp }]);
    };

    const testConnection = async () => {
        addDebugInfo('Testing backend connection...', 'info');
        
        try {
            const response = await fetch('https://localhost:5000/test');
            if (response.ok) {
                const data = await response.text();
                addDebugInfo(`✅ Backend connected: ${data}`, 'success');
            } else {
                addDebugInfo(`❌ Backend error: ${response.status}`, 'error');
            }
        } catch (error) {
            addDebugInfo(`❌ Connection failed: ${error.message}`, 'error');
            
            if (error.message.includes('certificate') || error.message.includes('SSL')) {
                addDebugInfo('🔧 Certificate issue detected. Accept certificates in browser.', 'warning');
            }
        }
    };

    const testLogin = async () => {
        if (!email || !password) {
            addDebugInfo('❌ Please enter email and password', 'error');
            return;
        }

        addDebugInfo(`Attempting login for: ${email}`, 'info');

        try {
            const loginData = { email, password };
            addDebugInfo('Sending login request...', 'info');
            
            const response = await loginUserApi(loginData);
            
            if (response.data.success) {
                addDebugInfo('✅ Login successful!', 'success');
                addDebugInfo(`Token received: ${response.data.token ? 'Yes' : 'No'}`, 'info');
            } else {
                addDebugInfo(`❌ Login failed: ${response.data.message}`, 'error');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            addDebugInfo(`❌ Login error: ${errorMessage}`, 'error');
            
            if (error.code === 'ERR_CERT_AUTHORITY_INVALID') {
                addDebugInfo('🔧 Certificate not accepted. Visit https://localhost:5000/test', 'warning');
            }
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace' }}>
            <h2>🔍 Login Debugger</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testConnection}
                    style={{ padding: '10px', marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
                >
                    Test Backend Connection
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ padding: '10px', marginRight: '10px', width: '200px' }}
                />
                <button 
                    onClick={testLogin}
                    style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none' }}
                >
                    Test Login
                </button>
            </div>

            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px', maxHeight: '400px', overflow: 'auto' }}>
                <h3>Debug Log:</h3>
                {debugInfo.map((info, index) => (
                    <div 
                        key={index} 
                        style={{ 
                            padding: '5px 0', 
                            color: info.type === 'error' ? 'red' : info.type === 'success' ? 'green' : info.type === 'warning' ? 'orange' : 'black'
                        }}
                    >
                        <span style={{ color: '#666' }}>[{info.timestamp}]</span> {info.message}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '20px', backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px' }}>
                <h4>🛠️ Common Solutions:</h4>
                <ul>
                    <li>Accept certificates: Visit <a href="https://localhost:5000/test" target="_blank" rel="noopener noreferrer">https://localhost:5000/test</a></li>
                    <li>Clear browser cache (Ctrl+Shift+Delete)</li>
                    <li>Try incognito/private browsing mode</li>
                    <li>Check if backend is running (npm start in backend folder)</li>
                    <li>Disable browser extensions temporarily</li>
                </ul>
            </div>
        </div>
    );
};

export default LoginDebugger;

// Test script to diagnose login issues
const testLogin = async () => {
    const testData = {
        email: "test@example.com",
        password: "Test123!@#"
    };

    try {
        console.log("Testing backend connection...");
        
        // Test basic connection
        const testResponse = await fetch('https://localhost:5000/test', {
            method: 'GET'
        });
        
        if (testResponse.ok) {
            console.log("✅ Backend connection successful");
            const testData = await testResponse.text();
            console.log("Response:", testData);
        } else {
            console.log("❌ Backend connection failed:", testResponse.status);
            return;
        }

        // Test login endpoint
        console.log("Testing login endpoint...");
        const loginResponse = await fetch('https://localhost:5000/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData),
            credentials: 'include'
        });

        const loginResult = await loginResponse.json();
        console.log("Login response:", loginResult);

        if (loginResponse.ok) {
            console.log("✅ Login endpoint working");
        } else {
            console.log("❌ Login failed:", loginResult.message);
        }

    } catch (error) {
        console.error("❌ Connection error:", error.message);
        
        if (error.message.includes('certificate')) {
            console.log("\n🔧 Certificate Issue Detected!");
            console.log("Solutions:");
            console.log("1. Open https://localhost:5000/test in your browser");
            console.log("2. Click 'Advanced' → 'Proceed to localhost (unsafe)'");
            console.log("3. Repeat for https://localhost:3000");
        }
        
        if (error.message.includes('CORS')) {
            console.log("\n🔧 CORS Issue Detected!");
            console.log("Solutions:");
            console.log("1. Ensure both frontend and backend use HTTPS");
            console.log("2. Check CORS configuration in backend");
        }
    }
};

// Instructions
console.log("🚀 Login Diagnosis Tool");
console.log("======================");
console.log("1. Make sure backend is running: npm start in backend folder");
console.log("2. Accept certificates in browser if prompted");
console.log("3. Run this test\n");

// Run test if backend URL is accessible
testLogin();

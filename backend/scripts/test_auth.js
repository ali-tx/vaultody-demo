const { generateSignature } = require('../src/vaultody/auth');
const crypto = require('crypto');

console.log('🧪 Vaultody Authentication Logic Test');
console.log('=====================================');

try {
    // 1. Setup Mock Credentials
    // "test_secret" base64 encoded is "dGVzdF9zZWNyZXQ="
    const mockSecret = Buffer.from('test_secret').toString('base64');
    const timestamp = '1700000000';
    const method = 'GET';
    const pathSigned = '/vaults/all';
    const body = '{}';
    const query = '{}';

    console.log(`Input:`);
    console.log(`- Secret (Base64): ${mockSecret}`);
    console.log(`- Timestamp: ${timestamp}`);
    console.log(`- Method: ${method}`);
    console.log(`- Path (Signed): ${pathSigned}`);

    // 2. Generate Signature using our module
    const signature = generateSignature(mockSecret, timestamp, method, pathSigned, body, query);
    console.log(`\nGenerated Signature: ${signature}`);

    // 3. Verify Manually
    // Expected Message: timestamp + method + pathSigned + body + query
    const message = timestamp + method + pathSigned + body + query;
    const hmac = crypto.createHmac('sha256', Buffer.from(mockSecret, 'base64'));
    hmac.update(message);
    const expectedSignature = hmac.digest('base64');

    console.log(`Expected Signature:  ${expectedSignature}`);

    if (signature === expectedSignature) {
        console.log('\n✅ PASS: Signature matches expected HMAC-SHA256 output.');
    } else {
        console.error('\n❌ FAIL: Signature mismatch.');
        console.error(`Got: ${signature}`);
        console.error(`Exp: ${expectedSignature}`);
        process.exit(1);
    }

} catch (e) {
    console.error('\n❌ Error running test:', e.message);
}

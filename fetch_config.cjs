const { exec } = require('child_process');
exec('firebase apps:sdkconfig web --project resumegen-9f570', (err, stdout, stderr) => {
    if (err) { console.error(err); return; }
    console.log('---START---');
    console.log(stdout);
    console.log('---END---');
});

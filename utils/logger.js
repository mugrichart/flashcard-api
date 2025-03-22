const fs = require('fs');

function logContent(content) {
    const filePath = `./utils/old-logs/log-${Math.floor(Date.now() / 1000)}.txt`;

    try {
        // Write to old log file synchronously
        fs.writeFileSync(filePath, `${new Date().toLocaleString()}\n\n${content || 'nothing'}`);
        console.log('File written successfully to old logs!');
    } catch (err) {
        console.error('Error writing to the old log file:', err);
    }

    try {
        // Write to current log file synchronously
        fs.writeFileSync('./utils/current-log.txt', `${new Date().toLocaleString()}\n\n${content || 'nothing'}`);
        console.log('File written successfully to current log!');
    } catch (err) {
        console.error('Error writing to the current log file:', err);
    }

    console.log('Logging process completed.');
}

module.exports = logContent;

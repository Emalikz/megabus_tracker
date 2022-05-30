const qrCode= require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const puppeteer = require('puppeteer');

// const SESION_FILE_PATH = './sesion.json';
// let session_data = {};

// if (fs.existsSync(SESION_FILE_PATH)) {
//     session_data = require(SESION_FILE_PATH);
// }
// const client = new Client({
//     session_data
// });
// client.initialize();
// client.on('qr', qr => {
//     qrCode.generate(qr, { small: true });
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('authenticated', session => {
//     console.log('Client is authenticated!');
//     console.log('Session: ', session);
//     fs.writeFile(SESION_FILE_PATH, JSON.stringify(session));
// })

// client.on('auth_failure', msg => {
//     console.error('Authentication failure', msg);
// });

(async () => {
    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();
    await page.goto('http://www.megatarjeta.com.co/index/saldo');
    await page.screenshot({ path: 'screenshot.png' });
    const [tarjeta] = await page.$$("#tarjeta");
    await tarjeta.type('3153268251');
    const [search] = await page.$$("input[type=submit]");
    await search.click();
    await page.waitForNavigation();

    const saldo = await page.waitForSelector("#tdcomponenteSiglaDet").then(async () => {
        const texto_saldo = await page.evaluate(() => document.querySelectorAll("#tdcomponenteSiglaDet")[1].textContent);
        const saldo_actual = texto_saldo.split("$")[1];
        return parseInt(saldo_actual.replace(/\,/g, ''));
    });
})()
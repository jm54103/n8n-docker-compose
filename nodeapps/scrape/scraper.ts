import puppeteer, { Browser, Page } from 'puppeteer-core';

async function runScraper(): Promise<void> {
    // 1. กำหนดค่าการเชื่อมต่อ (ให้ตรงกับ Docker ที่คุณรันไว้)
    const browserWSEndpoint: string = 'ws://localhost:3000';

    try {
        // 2. เชื่อมต่อกับ Browserless
        const browser: Browser = await puppeteer.connect({
            browserWSEndpoint: browserWSEndpoint
        });

        const page: Page = await browser.newPage();

        // 3. ไปยัง URL เป้าหมาย
        await page.goto('http://siamchart.com/stock/SET100', { waitUntil: 'networkidle2' });

        // 4. รอให้ Element ที่มี class="table_data" ปรากฏขึ้นมา
        await page.waitForSelector('#table_data');
       

        // 5. ดึงข้อมูลจากตาราง       
        const data = await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('.tbl tr'));
            return rows.map(row => {
                const cells = Array.from(row.querySelectorAll('td'));
                return cells.map(cell => cell.innerText.trim());
            });
        });        
        console.log('Result:', data.length);                
        console.log('Header:', data[0]); // แสดง header ของตาราง
        console.log('Avg. Header:', data[1]); // แสดง Average 
        for(let i=2;i<data.length;i++){
            const row = data[i];
            const symbol = data[i][0];
            if(row.length > 1 && symbol !== 'Name' ) {
                console.log(`Row ${i}:`, data[i][0]);  
            }                      
        }
        await browser.close();  
        
    } catch (error) {
        console.error('Error during scraping:', error);
    }
}

runScraper();
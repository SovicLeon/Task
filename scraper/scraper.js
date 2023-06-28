const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();
  page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36');
  page.setJavaScriptEnabled(true);

  const numPages = 25; 
  const baseUrl = 'https://www.sreality.cz/en/search/for-sale/apartments?page=';

  const data = [];
  for (let i = 1; i <= numPages; i++) {
    const url = baseUrl + i;
    await page.goto(url, { waitUntil: 'networkidle2' });

    const pageData = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.property')); 
      return elements.map((element, index) => {
        const price = element.querySelector('.price')?.innerText.trim(); 
        const name = element.querySelector('.name')?.innerText.trim(); 
        const locality = element.querySelector('.locality')?.innerText.trim(); 
        const labels = element.querySelector('.labels')?.innerText.trim(); 
        const image = element.querySelector('img')?.getAttribute('src');
        return { index, price, name, locality, labels, image };
      });
    });

    data.push(...pageData);
  }

  
  const sqlCommands = data.map(item => {
    const { price, name, locality, labels, image } = item;
    const insertCommand = `INSERT INTO property (price, name, locality, labels, image) VALUES ('${price}', '${name}', '${locality}', '${labels}', '${image}');`;
    return insertCommand;
  });

  
  const filePath = 'data.sql'; 
  fs.writeFileSync(filePath, sqlCommands.join('\n'));

  console.log(data);
  await browser.close();
})();

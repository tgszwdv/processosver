const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');

export default async function handler(req, res) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
      // Descomente a linha abaixo se precisar de uma viewport padrão
      // defaultViewport: { width: 1280, height: 720 },
    });

    const page = await browser.newPage();
    const url = 'https://selecao-login.app.ufgd.edu.br/';
    await page.goto(url, { waitUntil: 'networkidle0' });

    const processos = await page.evaluate(() => {
      const processos = [];
      const rows = document.querySelectorAll('tr[ng-repeat="processo in ctrl.inscricoesAbertas track by $index"]');
      
      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const titulo = cells[0].innerText.trim();
        const descricao = cells[1].innerText.trim().replace('Mostrar mais', '').trim();
        const periodo = cells[2].innerText.trim();
        const editalUrl = cells[3].querySelector('a') ? cells[3].querySelector('a').href : '';
        const paginaUrl = cells[4].querySelector('a') ? cells[4].querySelector('a').href : '';

        if (!titulo.startsWith('PSIE')) {
          processos.push({
            titulo: titulo,
            descricao: descricao,
            periodo: periodo,
            url: paginaUrl,
            edital: editalUrl
          });
        }
      });
      
      return processos;
    });

    res.status(200).json({ processos });
  } catch (error) {
    console.error('Erro ao acessar a página de scraping:', error.message);
    res.status(500).send('Erro ao acessar a página de scraping');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

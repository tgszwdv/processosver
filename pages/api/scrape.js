import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export default async function handler(req, res) {
  let browser;

  try {
    // Inicie o Puppeteer com o Chrome fornecido pelo chrome-aws-lambda
    browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    const url = 'https://selecao-login.app.ufgd.edu.br/';
    await page.goto(url, { waitUntil: 'networkidle2' });

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

    console.log(processos);
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

const express = require('express');
const puppeteer = require('puppeteer');
const { URL } = require('url');
const mime = require('mime-types');

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// PROXYING

const fetchHTML = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();
  await browser.close();
  return content;
};

const proxyHTML = async (html, baseURL) => {
  const assetPattern = /(?:src|href)="([^"]+)"/g;

  html = html.replace(assetPattern, (match, url) => {
    const fullUrl = new URL(url, baseURL);
    console.log(`Replacing following url: ${fullUrl}`);
    return match.replace(url, `/proxy/${fullUrl}`);
  });

  return html;
};

const proxyJS = async (js, baseURL) => {
  console.log(`looking through: ${baseURL}`);
  const assetPattern = /\bhttps?:\/\/[^\s'"(){}[\]<>]+(?:\?[^\s'"(){}[\]<>]*)?/g;

  js = js.replace(assetPattern, (match, url) => {
    const fullUrl = new URL(url, baseURL);
    console.log(`JS MATCH: ${url}`);
    console.log(`Replacing following url: ${fullUrl}`);
    return match.replace(url, `/proxy/${fullUrl}`);
  });

  return js;
};

// Dynamically import node-fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.get('/fetch/*', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params[0]);
    const html = await fetchHTML(url);
    const proxiedHtml = await proxyHTML(html, url);
    res.setHeader('Content-Type', 'text/html');
    res.send(proxiedHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching the URL');
  }
});

app.get('/proxy/*', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params[0]);
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const mimeType = mime.contentType(contentType) || 'application/octet-stream';

    res.setHeader('Content-Type', mimeType);

    if (mimeType.startsWith('text/html')) {
      // Process HTML content
      const html = await response.text();
      const proxiedHtml = await proxyHTML(html, url);
      res.send(proxiedHtml);
    } else if (mimeType.startsWith('application/javascript')) {
      // Process text-based content (CSS, JS) as plain text
      if (mimeType.startsWith('application/javascript')) {
        const js = await response.text();
        const textContent = await proxyJS(js, url);
        res.send(textContent);
      }
    } else {
      // For binary content (images, etc.), pipe the response stream
      response.body.pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching the asset');
  }
});

// PROXYING END

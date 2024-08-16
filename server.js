const express = require('express');
const puppeteer = require('puppeteer');
const { URL } = require('url');
const mime = require('mime-types');
const path = require('path');
const readline = require('readline');
const cors = require('cors');

const app = express();
const port = 3000;

var config = {}


app.use(cors({
  origin: 'coui://html_ui'
}));


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
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

  const targetPattern = /target="([^"]+)"/g;

  html = html.replace(targetPattern, (match,url) => {
    console.log(`Replacing target ${url}`);
    return match.replace(url, '_self')
  })

  return html;
};

const proxyJS = async (js, baseURL) => {
  console.log(`looking through: ${baseURL}`);
  const assetPattern = /\b(?:http|https)?:\/\/[^\s'"(){}[\]<>]+(?:\?[^\s'"(){}[\]<>]*)?/g;

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

// EFB

app.get('', async (req,res) => {
  try {
    res.send("SUCCESS")
  } catch (error) {
    console.error(error);
    res.status(500).send('Error @ root');
  }
})

app.get('/EFB/config', async (req,res) => {
  try {
    res.send(JSON.stringify(config))
  } catch (error) {
    console.error(error);
    res.status(500).send('Error @ EFB');
  }
})

app.get('/EFB/assets/*', async (req,res) => {
  const wildcard = req.params[0];

  const filePath = path.join(__dirname, `server/assets/${wildcard}`)

  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  })
})

app.get('/client', async (req,res) => {
  res.sendFile(path.join(__dirname, `server/html/style${config["EFB"]["style"]}/vEFB.html`))
})

app.get('/vEFB.js', async (req,res) =>{
  const wildcard = req.params[0];
  res.setHeader('Content-Type', 'application/javascript');

  res.sendFile(path.join(__dirname, `server/html/style${config["EFB"]["style"]}/vEFB.js`))
})

app.get('/main.css', async (req,res) =>{
  const wildcard = req.params[0];
  res.setHeader('Content-Type', 'text/css');

  console.log("Sending main.css")

  res.sendFile(path.join(__dirname, `electron/css/main.css`))
})

// Data Receiving

rl.on('line', (contents) => {
  console.log(`contents`, contents)
  m = JSON.parse(contents)
  command = m["data"][0];
  args = m["data"][1];

  console.log(command)

  switch(command) {
    case "refresh-server-data":
      console.log("S: Refreshing from electron-data")
      config = args[0]
  }
})



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
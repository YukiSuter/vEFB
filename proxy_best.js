import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

async function fetchAndModifyHtml(baseUrl) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        await page.goto(baseUrl, { waitUntil: 'networkidle2' });

        // Get the HTML content
        const html = await page.content();

        // Modify the HTML to load assets through the local server
        const modifiedHtml = html.replace(/(href|src)="([^"]+)"/g, (match, p1, p2) => {
            if (p2.startsWith('http') || p2.startsWith('//')) {
                // External references will be proxied
                return `${p1}="/proxy/${encodeURIComponent(p2)}"`;
            }
            // Local references will be served as they are
            return match;
        });

        await browser.close();
        return modifiedHtml;
    } catch (error) {
        await browser.close();
        throw error;
    }
}

async function proxyRequest(targetUrl, req, res) {
    const proxyUrl = targetUrl.startsWith('http') ? targetUrl : `http://${targetUrl}`;

    try {
        const response = await fetch(proxyUrl);
        const contentType = response.headers.get('content-type');
        const mimeType = mime.lookup(targetUrl.split('?')[0]);

        console.log(`Proxying request to: ${proxyUrl}`);
        console.log(`Detected MIME type: ${contentType || mimeType}`);

        if (contentType) {
            res.setHeader('Content-Type', contentType);
        } else if (mimeType) {
            res.setHeader('Content-Type', mimeType);
        }

        res.status(response.status);
        response.body.pipe(res);
    } catch (err) {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error.');
    }
}

app.get('/fetch/*', async (req, res) => {
    const url = req.params[0];
    console.log(`Fetching: ${url}`);
    if (!url) {
        return res.status(400).send('URL parameter is missing');
    }

    const protocol = url.startsWith('https') ? 'https' : 'http';
    const baseUrl = `${protocol}://${url}`;
    const mimeType = mime.lookup(baseUrl.split('?')[0]);

    if (mimeType && (mimeType.includes('html') || mimeType === 'application/xml')) {
        try {
            const modifiedHtml = await fetchAndModifyHtml(baseUrl);
            res.send(modifiedHtml);
        } catch (error) {
            res.status(500).send(`Error fetching the page: ${error.message}`);
        }
    } else {
        // Proxy request if it's not an HTML file
        await proxyRequest(url, req, res);
    }
});

// Custom proxy middleware to handle external asset requests and bypass CORS
app.use('/proxy/*', async (req, res) => {
    const targetUrl = decodeURIComponent(req.url.replace('/proxy/', ''));
    await proxyRequest(targetUrl, req, res);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

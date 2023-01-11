import puppeteer from 'puppeteer';
import { RZCharacteristic, RZProduct } from '../types/RZ';
import globalConfig from '../globalConfig';

export default async function getCompProps(link: string): Promise<[RZProduct[], RZCharacteristic[]]> {
    const linkMatch = link.match(globalConfig.rzLinkRegex)
    if (!linkMatch) {
        throw new Error('Invalid Link')
    }
    const locale = linkMatch[1] ? 'ua' : 'ru'
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(linkMatch[0]);

    await page.waitForSelector('rz-products-section > ul.products-grid > li');

    // Extract the results from the page.
    const products = await page.$$eval('rz-products-section > ul.products-grid > li', (productsSection: any[]) => {
        return productsSection.map(x => x.__ngContext__[35].product as RZProduct)
    });
    await page.waitForSelector('rz-char-section-list > ul.characteristic-list > li');
    const options: RZCharacteristic[] = await page.$$eval('rz-char-section-list > ul.characteristic-list > li', (productsSection: any[]) => {
        const sellers = productsSection[0].__ngContext__[34].charData.options
        const options = productsSection[1].__ngContext__[34].charData.options
        return [...sellers, ...options]
    });
    options[0] = {
        ...options[0],
        id: -1,
        order: -1,
        title: locale == 'ru' ? 'Продавец' : 'Продавець'
    }
    await browser.close();
    return [products, options]
}
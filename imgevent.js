const puppeteer = require("puppeteer");
let imageUrls = [];
let errorUrls = [];
const download = require("image-downloader");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.exposeFunction("onImgLoad", (...attrs) => {
    console.log(attrs)
  })

  const getImageSrc = async (index) => {
    const imageUrl = await page.evaluate(() => {
      return document.querySelector("#DocumentoImg").getAttribute("src");
    });

    try {
      if (index)
        await download.image({
          url: `http://memoria.bn.br/DocReader/${imageUrl}`,
          dest: "./images/" + index + ".JPG",
        });
    } catch (err) {}

    return imageUrl;
  };

  const clickNext = async () =>
    await page.evaluate(() => document.querySelector("#OcorPosBtn").click());

  await page.goto(
    "http://memoria.bn.br/DocReader/DocReader.aspx?bib=089842_06&pesq=%22eurico%20nogueira%22&pagfis=27"
  );

  await page.waitForSelector("#zoomdiv");
  await page.waitForSelector("#DocumentoImg");

  await page.evaluate(() => {
    document.querySelector("#zoomdiv").style.display = "block";
    document.querySelector("#Zoom100Btn").click();
    console.log(document.querySelector("#DocumentoImg"))
    document.querySelector("#DocumentoImg").onload = (...attrs) => {
      console.log('loaded', attrs)
      window.onImgLoad(attrs)
    }
  });

  // browser.close();
})();

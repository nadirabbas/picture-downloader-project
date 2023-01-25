const puppeteer = require("puppeteer");
let imageUrls = [];
let errorUrls = [];
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch-commonjs");

let page;
(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  page = await browser.newPage();
  page.setDefaultTimeout(0);

  page.on("request", async (req) => {
    const url = req.url();
    if (!url.includes(".JPG")) return;

    const cookies = await page.cookies();
    const rawCookieString = cookies
      .map(({ name, value }) => `${name}=${value};`)
      .join(" ");

    await fetch(req.url(), {
      headers: {
        cookie: rawCookieString,
      },
    }).then((res) => {
      console.log(`Download started for ` + imageUrls.length);
      imageUrls.push(req.url());
      return res.body.pipe(
        fs.createWriteStream(
          path.resolve(__dirname, "images/" + imageUrls.length + ".jpeg")
        )
      );
    });
  });

  const waitForLoaderToHide = async () =>
    await page.waitForSelector("#updateprogressdiv", { hidden: true });
  const waitForSrcChange = async (image) =>
    await page.waitForFunction(
      (oldSrc) =>
        document.querySelector("#DocumentoImg").getAttribute("src") !== oldSrc,
      {
        timeout: 60 * 1000 * 10,
      },
      image
    );
  const getImageSrc = async () =>
    await page.evaluate(() =>
      document.querySelector("#DocumentoImg").getAttribute("src")
    );

  const clickNext = async () =>
    await page.evaluate(() => document.querySelector("#OcorPosBtn").click());

  // 600 55400
  await page.goto(
    "http://memoria.bn.br/DocReader/DocReader.aspx?bib=089842_06&pesq=%22eurico%20nogueira%22&pagfis=27"
  );

  await page.waitForSelector("#zoomdiv");
  await page.evaluate(() => {
    document.querySelector("#zoomdiv").style.display = "block";
    document.querySelector("#Zoom100Btn").click();
  });

  let image = await getImageSrc();

  for (let index = 599; index <= 599; index++) {
    try {
      await waitForSrcChange(image);
      image = await getImageSrc();
      fs.writeFile("./images.json", JSON.stringify(imageUrls), {}, () => {});
    } catch (err) {
      console.log(err);
      errorUrls.push(index);
      fs.writeFile("./errors.json", JSON.stringify(errorUrls), {}, () => {});
    }
    await clickNext();
  }

  browser.close();
})();

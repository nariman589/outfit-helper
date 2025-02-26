import puppeteer, { Browser, Page } from "puppeteer";
import { ClothingItem, ParsedRequest, RequiredShops } from "./types";

interface SearchResult {
  id: string;
  name: string;
  brand: string;
  price: string | number | null;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  imageUrl: string;
  productUrl: string;
  shop: string;
}

interface ItemGroup {
  type: string;
  products: SearchResult[];
}

class GPTScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private PRODUCTS_PER_TYPE = 4;

  constructor() {}

  private async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: "shell",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
        ],
      });
    }
    if (!this.page) {
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1920, height: 1080 });
      await this.page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      );
    }
  }

  public async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  private async scrapeAliExpress(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector(
        '[class^="red-snippet_RedSnippet__grid__"]',
        { timeout: 10000 }
      );

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          '[class^="red-snippet_RedSnippet__grid__"] [class^="red-snippet_RedSnippet__container__"]'
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(
              '[class^="red-snippet_RedSnippet__title__"]'
            );
            const priceElement = card.querySelector(
              '[class^="red-snippet_RedSnippet__priceNew__"]'
            );
            const imageElement = card.querySelector(
              '[class^="gallery_Gallery__image__"]'
            ) as HTMLImageElement;
            const linkElement = card.querySelector(
              '[class^="red-snippet_RedSnippet__gallery__"]'
            ) as HTMLAnchorElement;

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;

            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = "";

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              imageUrl,
              productUrl,
              shop: "Aliexpress",
            };
          });
      });

      // Фильтруем и берем только первые 5 валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }

  private async scrapeAsos(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector('[class^="listingPage"]', {
        timeout: 10000,
      });

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          '[class^="listingPage"] [aria-label="product"]'
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(
              '[class^="productDescription"]'
            );
            const priceElement = card.querySelector('[class^="price"]');
            const imageElement = card.querySelector("img") as HTMLImageElement;
            const linkElement = card.querySelector(
              '[class^="productLink"]'
            ) as HTMLAnchorElement;

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;

            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = "";

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              imageUrl,
              productUrl,
              shop: "Asos",
            };
          });
      });

      // Фильтруем и берем только первые 5 валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  private async scrapeKaspi(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector(".item-cards-grid", { timeout: 10000 });

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          ".item-cards-grid .item-card"
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(".item-card__name-link");
            const priceElement = card.querySelector(".item-card__prices-price");
            const imageElement = card.querySelector(
              ".item-card__image"
            ) as HTMLImageElement;
            const linkElement = card.querySelector(
              ".item-card__name-link"
            ) as HTMLAnchorElement;

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;

            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = "";

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              imageUrl,
              productUrl,
              shop: "Kaspi",
            };
          });
      });

      // Фильтруем и берем только первые PRODUCTS_PER_TYPE валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  private async scrapeAmazon(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector(".s-search-results", { timeout: 10000 });

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          ".s-search-results .a-section"
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(
              ".a-size-base-plus a-spacing-none a-color-base a-text-normal"
            );
            const priceElement = card.querySelector(".a-offscreen");
            const imageElement = card.querySelector(
              ".s-image"
            ) as HTMLImageElement;
            const linkElement = card.querySelector(
              ".a-link-normal"
            ) as HTMLAnchorElement;

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;
            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = "";

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              imageUrl,
              productUrl,
              shop: "Amazon",
            };
          });
      });

      // Фильтруем и берем только первые 5 валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  private async scrapeLamoda(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector(".grid__catalog", { timeout: 10000 });

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          ".grid__catalog .x-product-card__card"
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(
              ".x-product-card-description__product-name"
            );
            const priceElement = card.querySelector(
              ".x-product-card-description__price-new"
            );
            const oldPriceElement = card.querySelector(
              ".x-product-card-description__price-old"
            );
            const imageElement = card.querySelector(
              ".x-product-card__pic-img"
            ) as HTMLImageElement;
            const linkElement = card.querySelector(
              ".x-product-card__pic"
            ) as HTMLAnchorElement;
            const brandElement = card.querySelector(".brand-name");

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;
            const oldPrice = oldPriceElement
              ? parseInt(
                  oldPriceElement.textContent?.replace(/[^\d]/g, "") || "0"
                )
              : undefined;
            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = brandElement?.textContent?.trim() || "";

            const discount = oldPrice
              ? Math.round(((oldPrice - Number(price)) / oldPrice) * 100)
              : undefined;

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              oldPrice,
              discount,
              imageUrl,
              productUrl,
              shop: "Lamoda",
            };
          });
      });

      // Фильтруем и берем только первые 5 валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  private async scrapeFarfetch(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector("#catalog-grid", { timeout: 10000 });

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          '#catalog-grid [data-testid="productCard"]'
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(
              '[data-component="ProductCardDescription"]'
            );
            const priceElement = card.querySelector('[data-component="Price"]');
            const oldPriceElement = card.querySelector(".price__old-price");
            const imageElement = card.querySelector("img") as HTMLImageElement;
            const linkElement = card.querySelector("a") as HTMLAnchorElement;
            const brandElement = card.querySelector(
              '[data-component="ProductCardBrandName"]'
            );

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;
            const oldPrice = oldPriceElement
              ? parseInt(
                  oldPriceElement.textContent?.replace(/[^\d]/g, "") || "0"
                )
              : undefined;
            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = brandElement?.textContent?.trim() || "";

            const discount = oldPrice
              ? Math.round(((oldPrice - Number(price)) / oldPrice) * 100)
              : undefined;

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              oldPrice,
              discount,
              imageUrl,
              productUrl,
              shop: "Farfetch",
            };
          });
      });

      // Фильтруем и берем только первые 5 валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }
  private async scrapeWildberries(url: string): Promise<SearchResult[]> {
    if (!this.page) throw new Error("Browser not initialized");

    await this.page.goto(url, { waitUntil: "networkidle0" });
    console.log("Scraping URL:", url);

    try {
      // Wait for product cards to load
      await this.page.waitForSelector(".product-card-list", { timeout: 10000 });

      // Extract product information
      const results = await this.page.evaluate(() => {
        const products = document.querySelectorAll(
          ".product-card-list .product-card"
        );
        return Array.from(products)
          .slice(0, 10) // Берем больше результатов для фильтрации
          .map((card) => {
            const nameElement = card.querySelector(".product-card__name");
            const priceElement = card.querySelector(".price__lower-price");
            const oldPriceElement = card.querySelector(".price__old-price");
            const imageElement = card.querySelector(
              ".j-thumbnail"
            ) as HTMLImageElement;
            const linkElement = card.querySelector(
              ".product-card__link"
            ) as HTMLAnchorElement;
            const brandElement = card.querySelector(".brand-name");

            const name =
              nameElement?.textContent?.trim().replace("/ ", "") || "";
            const price = priceElement ? priceElement.textContent || 0 : 0;
            const oldPrice = oldPriceElement
              ? parseInt(
                  oldPriceElement.textContent?.replace(/[^\d]/g, "") || "0"
                )
              : undefined;
            const imageUrl = imageElement?.src || "";
            const productUrl = linkElement?.href || "";
            const brand = brandElement?.textContent?.trim() || "";

            const discount = oldPrice
              ? Math.round(((oldPrice - Number(price)) / oldPrice) * 100)
              : undefined;

            return {
              id:
                linkElement?.dataset.popup ||
                Math.random().toString(36).substring(7),
              name,
              brand,
              price,
              oldPrice,
              discount,
              imageUrl,
              productUrl,
              shop: "Wildberries",
            };
          });
      });

      // Фильтруем и берем только первые 5 валидных результатов
      return results
        .filter((result) => result.name && result.price)
        .slice(0, this.PRODUCTS_PER_TYPE);
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      return [];
    }
  }

  private async scrapeItemType(
    items: ClothingItem[],
    requiredShops: RequiredShops
  ): Promise<SearchResult[]> {
    const allResults: SearchResult[] = [];

    // Обрабатываем каждый предмет данного типа
    for (const item of items) {
      const searchQuery = item.query;
      const encodedQuery = encodeURIComponent(searchQuery);
      if (requiredShops.Wildberries) {
        const url = `https://www.wildberries.ru/catalog/0/search.aspx?search=${encodedQuery}`;
        const results = await this.scrapeWildberries(url);
        allResults.push(...results);
      }
      if (requiredShops.Lamoda) {
        const url = `https://www.lamoda.kz/catalogsearch/result/?q=${encodedQuery}`;
        const results = await this.scrapeLamoda(url);
        allResults.push(...results);
      }
      if (requiredShops.Kaspi) {
        const url = `https://kaspi.kz/shop/search/?text=${encodedQuery}`;
        const results = await this.scrapeKaspi(url);
        allResults.push(...results);
      }
      if (requiredShops.Aliexpress) {
        const url = `https://www.aliexpress.com/wholesale?catId=0&searchText=${encodedQuery}`;
        const results = await this.scrapeAliExpress(url);
        allResults.push(...results);
      }
      if (requiredShops.Amazon) {
        const url = `https://www.amazon.com/s?k=${encodedQuery}`;
        const results = await this.scrapeAmazon(url);
        allResults.push(...results);
      }
      if (requiredShops.Asos) {
        const url = `https://www.asos.com/search/?q=${encodedQuery}`;
        const results = await this.scrapeAsos(url);
        allResults.push(...results);
      }
      if (requiredShops.FarFetch) {
        const gender =
          searchQuery.toLowerCase().includes("женс") ||
          searchQuery.toLowerCase().includes("women")
            ? "women"
            : "men";
        const url = `https://www.farfetch.com/shopping/${gender}/search/items.aspx?q=${encodedQuery}`;
        const results = await this.scrapeFarfetch(url);
        allResults.push(...results);
      }
    }

    // Удаляем дубликаты по id
    const uniqueResults = Array.from(
      new Map(allResults.map((item) => [item.id, item])).values()
    );

    return uniqueResults;
  }

  public async scrapeAll(
    request: ParsedRequest,
    requiredShops: RequiredShops,
    itemsQuantity: number
  ): Promise<ItemGroup[]> {
    try {
      await this.initialize();
      if (!this.page) throw new Error("Failed to initialize page");
      this.PRODUCTS_PER_TYPE = itemsQuantity;
      // Группируем предметы по типу
      const itemsByType = new Map<string, any[]>();
      request.items.forEach((item) => {
        if (!itemsByType.has(item.type)) {
          itemsByType.set(item.type, []);
        }
        itemsByType.get(item.type)?.push(item);
      });

      // Собираем результаты для каждого типа
      const groupedResults: ItemGroup[] = [];
      for (const [type, items] of itemsByType) {
        const products = await this.scrapeItemType(items, requiredShops);
        if (products.length > 0) {
          groupedResults.push({ type, products });
        }
      }

      // Сортируем группы по важности типа
      const typeOrder = [
        "верхняя одежда",
        "платье/костюм",
        "топ",
        "низ",
        "обувь",
        "аксессуар",
      ];

      groupedResults.sort((a, b) => {
        const indexA = typeOrder.indexOf(a.type);
        const indexB = typeOrder.indexOf(b.type);
        return indexA - indexB;
      });

      return groupedResults;
    } catch (error) {
      console.error("Scraping error:", error);
      throw new Error(
        "Failed to scrape: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }
}

export default GPTScraper;

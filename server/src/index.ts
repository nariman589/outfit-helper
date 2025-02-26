import express from "express";
import cors from "cors";
import RequestParser from "./RequestParser";
import GPTScraper from "./GPTScraper";
import "dotenv/config";
import { PictureProperty, RequiredShops } from "./types";

async function searchOutfit(
  query: string,
  requiredShops: RequiredShops,
  itemsQuantity: number
) {
  const parser = new RequestParser();
  const scraper = new GPTScraper();

  try {
    const parsedRequest = await parser.parseRequest(query);
    const searchResults = await scraper.scrapeAll(
      parsedRequest,
      requiredShops,
      itemsQuantity
    );
    await scraper.close();

    return {
      success: true,
      query: {
        original: query,
        parsed: parsedRequest,
      },
      results: searchResults,
    };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}

async function getQueryByImg(img: string, pictureProperty: PictureProperty) {
  const parser = new RequestParser();
  try {
    const { query } = await parser.parseImg(img, pictureProperty);
    console.log(query);
    return query;
  } catch (error) {
    console.error("Img error:", error);
    throw error;
  }
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.post("/api/search", async (req: any, res: any) => {
  try {
    const { query, requiredShops, img, itemsQuantity, pictureProperty } =
      req.body;
    if (img && pictureProperty) {
      const queryByImg = await getQueryByImg(img, pictureProperty);
      const results = await searchOutfit(
        queryByImg,
        requiredShops,
        itemsQuantity
      );
      res.json(results);
      return;
    } else if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query is required",
      });
    }

    const results = await searchOutfit(query, requiredShops, itemsQuantity);
    res.json(results);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

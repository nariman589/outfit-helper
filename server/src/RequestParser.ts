import { ParsedRequest, PictureProperty } from "./types";

const OpenAI = require("openai");

class RequestParser {
  private openai: typeof OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async parseImg(img: string, pictureProperty: PictureProperty) {
    if (!img || typeof img !== "string") {
      throw new Error("Invalid query: must be a non-empty string");
    }

    const getBuilderByPictureProperty = () => {
      switch (pictureProperty) {
        case "on_image":
          console.log("on_image");
          return this.buildPromptOnImg(img);
        case "by_image":
          console.log("by_image");
          return this.buildPromptByImg(img);
        case "selfie":
          console.log("selfie");
          return this.buildPromptSelfieImg(img);
        default:
          throw new Error(`Invalid picture property: ${pictureProperty}`);
      }
    };

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o", // Изменена модель на поддерживающую изображения
        messages: getBuilderByPictureProperty(),
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return result;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse OpenAI response as JSON");
      }
      throw error;
    }
  }

  buildPromptOnImg(img: string) {
    return [
      {
        role: "system",
        content: `
          Ты эксперт по поиску одежды на маркетплейсах.
          
          Проанализируй предметы одежды на фото и создай точный поисковый запрос, 
          который поможет найти максимально похожие товары на маркетплейсе.
          
          Запрос должен включать:
          - Точное название предметов одежды
          - Цвет
          - Материал (если виден)
          - Ключевые особенности (фасон, детали, принт)
          - Стиль (casual, formal, sporty и т.д.)
          
          Оптимизируй запрос под поисковые системы маркетплейсов.
          Используй термины, которые часто встречаются в каталогах одежды.
          Запрос должен быть не более 100 символов.
          
          Формат ответа (строгий JSON):
          {
            "query": "оптимизированный поисковый запрос для маркетплейса"
          }
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Создай точный поисковый запрос для маркетплейса, чтобы найти максимально похожий предмет одежды.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${img}`,
            },
          },
        ],
      },
    ];
  }

  buildPromptByImg(img: string) {
    return [
      {
        role: "system",
        content: `
          Ты стилист-консультант онлайн-маркетплейса.
          
          Проанализируй предмет одежды на изображении и создай поисковый запрос 
          для поиска сочетающихся с ним предметов.
          
          Сначала определи:
          - Тип предмета
          - Цвет и стиль
          - Сезонность
          
          Затем создай запрос для поиска дополняющего предмета, который:
          - Хорошо сочетается по стилю
          - Подходит по цветовой гамме
          - Подходит для того же сезона/погоды
          - Создает законченный образ
          
          Запрос должен быть оптимизирован для поисковых систем маркетплейсов (не более 100 символов).
          
         Формат ответа (строгий JSON):
          {
            "query": "поисковый запрос для сочетающегося предмета"
          }
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Создай поисковый запрос для маркетплейса, чтобы найти предмет одежды, который будет хорошо сочетаться с тем, что изображено на фото.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${img}`,
            },
          },
        ],
      },
    ];
  }

  buildPromptSelfieImg(img: string) {
    return [
      {
        role: "system",
        content: `
          Ты профессиональный стилист-консультант маркетплейса одежды.
          
          Проанализируй фото человека и определи:
          - Цветотип внешности
          - Форму лица
          - Стиль, который подойдет этому человеку
          
          Твоя главная задача - создать точный поисковый запрос для маркетплейса одежды, 
          который поможет найти подходящие предметы гардероба.
          
          Запрос должен:
          - Включать конкретные предметы одежды
          - Указывать подходящие цвета
          - Содержать ключевые слова, по которым маркетплейс найдет релевантные товары
          - Быть лаконичным (не более 100 символов)
          
          Формат ответа (строгий JSON):
          {
            "query": "лаконичный поисковый запрос для маркетплейса"
          }
        `,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "На основе анализа внешности человека на фото, создай поисковый запрос для маркетплейса одежды, который поможет найти подходящие предметы гардероба.",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${img}`,
            },
          },
        ],
      },
    ];
  }

  buildPrompt(userQuery: string) {
    return `
      Ты эксперт по поиску одежды на маркетплейсах.
      
      Проанализируй запрос пользователя: "${userQuery}"
      
      Твоя задача - преобразовать этот запрос в эффективный поисковый запрос для маркетплейса одежды.
      Разбей его на отдельные запросы для каждого предмета одежды в образе.
      
      Для каждого запроса:
      - Используй термины, популярные в каталогах одежды
      - Включай конкретные характеристики (цвет, материал, фасон)
      - Делай запрос лаконичным (до 100 символов)
      - Учитывай контекст (сезон, повод, стиль)
      
      Формат ответа (строгий JSON):
      {
        "query": "исходный текст запроса",
        "style": "общий стиль образа (casual, business, sport и т.д.)",
        "items": [
          {
            "query": "оптимизированный поисковый запрос для этого предмета",
            "type": "категория предмета"
          }
        ]
      }
  
      Разрешенные категории для type:
      - верхняя одежда
      - платье/костюм
      - топ
      - низ
      - обувь
      - аксессуар
      
      Максимально оптимизируй каждый запрос под поисковые алгоритмы маркетплейсов.
    `;
  }

  async parseRequest(userQuery: string): Promise<ParsedRequest> {
    if (!userQuery || typeof userQuery !== "string") {
      throw new Error("Invalid query: must be a non-empty string");
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
            Ты опытный стилист-консультант по поиску одежды на маркетплейсах.
        
        Твоя задача:
        1. Анализировать запросы пользователей о подборе одежды
        2. Преобразовывать эти запросы в точные поисковые запросы для маркетплейсов
        3. Структурировать информацию в JSON для дальнейшего использования
        
        При создании поисковых запросов:
        - Используй точные названия типов одежды (рубашка, джинсы, куртка)
        - Указывай конкретные характеристики (цвет, материал, фасон)
        - Оптимизируй под поисковые системы маркетплейсов
        - Учитывай контекст (сезон, повод, гендер)
            `,
          },
          {
            role: "user",
            content: this.buildPrompt(userQuery),
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content);
      return this.validateResponse(result);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse OpenAI response as JSON");
      }
      throw error;
    }
  }

  private validateResponse(response: any): ParsedRequest {
    console.log(response);

    // Проверяем обязательные поля
    if (!response.query || !response.items) {
      throw new Error("Invalid response format: missing required fields");
    }

    // Проверяем корректность структуры items
    if (!Array.isArray(response.items) || response.items.length === 0) {
      throw new Error(
        "Invalid response format: items must be a non-empty array"
      );
    }

    // Проверяем каждый item на наличие обязательных полей
    response.items.forEach((item: any, index: number) => {
      if (!item.query) {
        throw new Error(`Invalid item format at index ${index}`);
      }
    });

    return response as ParsedRequest;
  }
}

export default RequestParser;

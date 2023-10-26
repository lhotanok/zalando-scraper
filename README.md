# Extract Rich Product Data With Zalando Scraper
Zalando Scraper is an Apify actor that allows you to extract data from Zalando, a leading online fashion retailer in Europe 🛍️. With this scraper, you can extract various data attributes from any product on Zalando's website. Whether you want to extract products based on a specific category, such as [Women’s shoes, fashion & accessories](https://www.zalando.co.uk/women/) category or its subcategories like [Women's Dresses](https://www.zalando.co.uk/womens-clothing-dresses/), Zalando Scraper has got you covered. You can also provide direct product URLs like [Jumper - mottled light grey](https://www.zalando.co.uk/evenandodd-wrap-cardigan-cardigan-mottled-light-grey-ev421i0d2-c11.html). Just note that while Zalando Scraper supports a wide range of URLs, not all variations may be supported due to different page layouts.

Let's explore one of the products to get a glimpse of the collected data:

**🔗 Product URL**: [Product URL](https://www.zalando.co.uk/evenandodd-wrap-cardigan-cardigan-mottled-light-grey-ev421i0d2-c11.html)

**👚 Product name**: Cardigan - mottled light grey

**🆔 SKU**: EV421I0D2-C11

**🏷️ Brand**: [Even&Odd](https://www.zalando.co.uk/even-odd/)

**🖼️ Thumbnail**:

<img src="https://img01.ztat.net/article/spp-media-p1/bf87feefa11e3580a023866b3d6584cb/a371932409b84fd0b1d2add290c5264b.jpg?imwidth=156&filter=packshot" alt="Thumbnail" style="float: left; margin-right: 100%; margin-bottom: 1%">

**💰 Price**: £31.99

**📏 Available Sizes**: XS, S, M, L, XL, XXL, 3XL

**📄 Product Attributes**:

- **Neckline**: Cache-coeur
- **Fastening**: Laces
- **Pattern**: Marl

This example showcases the data extracted from one specific product using Zalando Scraper. You can utilize the scraper to extract data for any product available on Zalando's website.

Check out a full output for [Cardigan - mottled light grey](https://www.zalando.co.uk/evenandodd-wrap-cardigan-cardigan-mottled-light-grey-ev421i0d2-c11.html):

```json
{
  "url": "https://www.zalando.co.uk/evenandodd-wrap-cardigan-cardigan-mottled-light-grey-ev421i0d2-c11.html",
  "name": "Cardigan - mottled light grey",
  "sku": "EV421I0D2-C11",
  "brand": {
    "name": "Even&Odd",
    "uri": "https://www.zalando.co.uk/even-odd/"
  },
  "flags": [],
  "comingSoon": false,
  "thumbnail": "https://img01.ztat.net/article/spp-media-p1/bf87feefa11e3580a023866b3d6584cb/a371932409b84fd0b1d2add290c5264b.jpg?imwidth=156&filter=packshot",
  "images": [
    "https://img01.ztat.net/article/spp-media-p1/bf87feefa11e3580a023866b3d6584cb/a371932409b84fd0b1d2add290c5264b.jpg",
    "https://img01.ztat.net/article/spp-media-p1/9840961aaf5b3cbe8b67cd265d630bef/5e3f19c0d69b4cc68838c10f956d67ee.jpg",
    "https://img01.ztat.net/article/spp-media-p1/b4b740b8982c344c95791f1afb864220/5316f60a27554a43acdba91c80b6dd89.jpg"
  ],
  "videos": [],
  "category": "Cardigan",
  "color": {
    "name": "mottled light grey",
    "label": "mottled light grey"
  },
  "formattedPrice": {
    "original": "£31.99",
    "current": "£31.99",
    "promotional": null
  },
  "priceCurrency": "GBP",
  "price": {
    "original": 31.99,
    "current": 31.99,
    "promotional": null
  },
  "sizes": [
    {
      "size": "XS",
      "sku": "EV421I0D2-C1100XS000",
      "stockStatus": "OUT_OF_STOCK"
    },
    {
      "size": "S",
      "sku": "EV421I0D2-C11000S000",
      "stockStatus": "MANY"
    },
    {
      "size": "M",
      "sku": "EV421I0D2-C11000M000",
      "stockStatus": "MANY"
    },
    {
      "size": "L",
      "sku": "EV421I0D2-C11000L000",
      "stockStatus": "MANY"
    },
    {
      "size": "XL",
      "sku": "EV421I0D2-C1100XL000",
      "stockStatus": "MANY"
    },
    {
      "size": "XXL",
      "sku": "EV421I0D2-C110XXL000",
      "stockStatus": "MANY"
    },
    {
      "size": "3XL",
      "sku": "EV421I0D2-C1103XL000",
      "stockStatus": "MANY"
    }
  ],
  "available": true,
  "sizeAdvice": "SMALLER_SIZE",
  "navigationTargetGroup": "WOMEN",
  "condition": null,
  "attributeCategories": [
    {
      "categoryId": "material_care",
      "categoryName": "Material & care",
      "attributes": [
        {
          "key": "Outer fabric material",
          "value": "62% polyester, 34% acrylic, 4% elastane"
        },
        {
          "key": "Fabric",
          "value": "Knit"
        },
        {
          "key": "Care instructions",
          "value": "Do not tumble dry, machine wash at 30 °C, machine wash on gentle cycle, do not bleach"
        }
      ]
    },
    {
      "categoryId": "details",
      "categoryName": "Details",
      "attributes": [
        {
          "key": "Neckline",
          "value": "Cache-coeur"
        },
        {
          "key": "Fastening",
          "value": "Laces"
        },
        {
          "key": "Pattern",
          "value": "Marl"
        },
        {
          "key": "Article number",
          "value": "EV421I0D2-C11"
        }
      ]
    },
    {
      "categoryId": "size_fit",
      "categoryName": "Size & fit",
      "attributes": [
        {
          "key": "Fit",
          "value": "Regular Fit"
        },
        {
          "key": "Shape",
          "value": "Fitted"
        },
        {
          "key": "Length",
          "value": "Normal"
        },
        {
          "key": "Sleeve length",
          "value": "Long"
        }
      ]
    }
  ]
}
```



## Integrations and Zalando Scraper

In addition to its scraping capabilities, Zalando Scraper seamlessly integrates with various cloud services and web apps through the <a href="https://apify.com/integrations" target="_blank">integrations on the Apify platform</a>. You can connect Zalando Scraper with tools like Make, Zapier, Slack, Airbyte, GitHub, Google Sheets, Google Drive, and many more. You can also leverage <a href="https://docs.apify.com/integrations/webhooks" target="_blank">webhooks</a> to automate actions whenever specific events occur. For example, you can set up notifications whenever Zalando Scraper successfully completes a run.

## Using Zalando Scraper with the Apify API

The Apify API provides programmatic access to the Apify platform, allowing you to manage, schedule, and run Apify actors. With the API, you can access datasets, monitor actor performance, fetch results, create and update versions, and more. If you prefer Node.js, you can utilize the `apify-client` NPM package, while Python users can take advantage of the `apify-client` PyPI package.

For detailed information and code examples, refer to the comprehensive <a href="https://docs.apify.com/api/v2" target="_blank">Apify API reference</a> documentation or explore the <a href="https://apify.com/lhotanok/zalando-scraper/api" target="_blank">API tab</a> for practical code samples.

## Other E-commerce Scrapers

If you're interested in scraping data from other e-commerce platforms, Apify offers a range of dedicated scrapers. You can explore options like [Amazon Product Scraper](https://apify.com/junglee/amazon-crawler), [eBay Scraper](https://apify.com/dtrungtin/ebay-items-scraper), [AliExpress Scraper](https://apify.com/epctex/aliexpress-scraper), [Etsy Scraper](https://apify.com/epctex/etsy-scraper), [Walmart Scraper](https://apify.com/epctex/walmart-scraper) or [Allegro Scraper](https://apify.com/lhotanok/allegro-scraper). Simply browse the [E-commerce Category](https://apify.com/store/categories/ecommerce) in the Apify Store to explore more options.

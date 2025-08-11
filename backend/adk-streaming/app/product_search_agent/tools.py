products = [
    {
        "id": "1",
        "name": "Classic Jacket",
        "price": "89.99",
        "originalPrice": "120.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754906657/Large_PNG-AdobeStock_328526349_ve8zsc.png",
        "category": "Jackets",
        "brand": "Winter Warmth",
        "rating": "4.5",
        "reviews": "128",
        "colors": ["Red", "Black", "White"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "isSale": "true"
    },
    {
        "id": "7",
        "name": "Floral Long Skirt",
        "price": "189.99",
        "originalPrice": "250.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/FqIpmjbq_b302522366804128ab739d0ec76de21c_es9jhl.webp",
        "category": "Bottoms",
        "brand": "Urban Style",
        "rating": "4.9",
        "reviews": "67",
        "colors": ["Floral", "Black", "Gray"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "isSale": "true"
    },
    {
        "id": "4",
        "name": "Stripped Full Sleve Tee",
        "price": "120.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/Q2rggAyB_3b0cab885126474fbfa92ef39c9a71f3_t1p7um.webp",
        "category": "Top",
        "brand": "Luxe Leather",
        "rating": "4.7",
        "reviews": "45",
        "colors": ["Brown", "Black", "Tan"],
        "sizes": ["One Size"]
    },
    {
        "id": "5",
        "name": "Cotton T-Shirt",
        "price": "29.99",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754908235/9WXS83ig_09605e25e9ee4e7abe0c5dacca407897_gwbftr.webp",
        "category": "Top",
        "brand": "Basic Essentials",
        "rating": "4.2",
        "reviews": "312",
        "colors": ["Red", "black", "Green"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        "id": "8",
        "name": "Blue Torn Jeans",
        "price": "110.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907985/8AGxMXSN_c551b029c31740a7a20c2a654616e65f_m2q4fn.webp",
        "category": "Jeans",
        "brand": "SportMax",
        "rating": "4.4",
        "reviews": "203",
        "colors": ["Black", "White", "Blue"],
        "sizes": ["28", "30", "32"],
        "isNew": "true"
    },
    {
        "id": "6",
        "name": "Blue Top",
        "price": "95.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754908234/AB2e6GY2_95df2e8430d844a4a3bfc69a6d3a95ca_pr2s4x.webp",
        "category": "Top",
        "brand": "Denim Dreams",
        "rating": "4.6",
        "reviews": "178",
        "colors": ["Blue", "Black", "Light Blue"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"]
    },
    {
        "id": "9",
        "name": "Wool Blend Jeans",
        "price": "189.99",
        "originalPrice": "250.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/r95xqygW_908f4b3bf54842f7875feb024d8d28b2_lks7dh.webp",
        "category": "Jeans",
        "brand": "Winter Warmth",
        "rating": "4.9",
        "reviews": "67",
        "colors": ["Black", "Black", "Gray"],
        "sizes": ["28", "30", "32"],
        "isSale": "true"
    },
    {
        "id": "11",
        "name": "Black Jeans",
        "price": "110.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/eGFueqdK_2183ade8838248a48d1066438124430e_br4gzz.webp",
        "category": "Jeans",
        "brand": "SportMax",
        "rating": "4.4",
        "reviews": "203",
        "colors": ["Black", "White", "Blue"],
        "sizes": ["28", "30", "32"],
        "isNew": "true"
    },
    {
        "id": "10",
        "name": "White Linen",
        "price": "110.0",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/azOKK8sr_387210fce6ac4ffca448f6a070440ea9_jad99s.webp",
        "category": "Jeans",
        "brand": "SportMax",
        "rating": "4.4",
        "reviews": "203",
        "colors": ["White", "Blue"],
        "sizes": ["28", "30", "32"],
        "isNew": "true"
    },
    {
        "id": "3",
        "name": "Casual White Top",
        "price": "79.99",
        "image": "https://res.cloudinary.com/dqhry9ysg/image/upload/v1754907984/7l7oKg5A_04ea01c32d3543b89ae4280d67e283e0_x791cu.webp",
        "category": "Top",
        "brand": "ComfortStep",
        "rating": "4.3",
        "reviews": "256",
        "colors": ["White", "Black", "Gray"],
        "sizes": ["XS", "S", "M", "L", "XL"]
    }
]


def load_products_details() -> dict:
    """
    Load product details.

    Returns:
        list: The list of dictionary for each available product with its details.
    """
    return {"status": "ok", "product_details": products}


def format_product_response(product_ids: list[str]) -> dict:
    """
    Formats the list of products returned into a JSON array. This function should be called in order to format products to display to the user on the frontend.

    Arguments:
        product_ids (list[str]): The list of product ids to format.
    Returns:
        dict: The dictionary containing the status of the tool call and the list of products returned or empty list if no single product found.
    """

    return {
        "status": "ok",
        "products": [
            {
                "name": item.get("name"),
                "price": item.get("price"),
            }
            for item in products
            if item["id"] in product_ids
        ],
    }

products = [
    {
        "id": "1",
        "name": "Classic Denim Jacket",
        "price": "89.99",
        "originalPrice": "120.0",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Jackets",
        "brand": "Urban Style",
        "rating": "4.5",
        "reviews": "128",
        "colors": "Blue",
        "sizes": ["XS", "S", "M", "L", "XL"],
        "isSale": "true",
    },
    {
        "id": "2",
        "name": "Floral Summer Dress",
        "price": "65.99",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Dresses",
        "brand": "Bloom & Co",
        "rating": "4.8",
        "reviews": "89",
        "colors": ["Pink", "Blue", "Yellow"],
        "sizes": ["XS", "S", "M", "L"],
        "isNew": "true",
    },
    {
        "id": "3",
        "name": "Casual White Sneakers",
        "price": "79.99",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Shoes",
        "brand": "ComfortStep",
        "rating": "4.3",
        "reviews": "256",
        "colors": ["White", "Black", "Gray"],
        "sizes": ["6", "7", "8", "9", "10", "11"],
    },
    {
        "id": "4",
        "name": "Leather Crossbody Bag",
        "price": "120.0",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Accessories",
        "brand": "Luxe Leather",
        "rating": "4.7",
        "reviews": "45",
        "colors": ["Brown", "Black", "Tan"],
        "sizes": ["One Size"],
    },
    {
        "id": "5",
        "name": "Striped Cotton T-Shirt",
        "price": "29.99",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Tops",
        "brand": "Basic Essentials",
        "rating": "4.2",
        "reviews": "312",
        "colors": ["Navy", "Red", "Green"],
        "sizes": ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
        "id": "6",
        "name": "High-Waisted Jeans",
        "price": "95.0",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Bottoms",
        "brand": "Denim Dreams",
        "rating": "4.6",
        "reviews": "178",
        "colors": ["Blue", "Black", "Light Blue"],
        "sizes": ["24", "26", "28", "30", "32", "34"],
    },
    {
        "id": "7",
        "name": "Wool Blend Coat",
        "price": "189.99",
        "originalPrice": "250.0",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Outerwear",
        "brand": "Winter Warmth",
        "rating": "4.9",
        "reviews": "67",
        "colors": ["Camel", "Black", "Gray"],
        "sizes": ["XS", "S", "M", "L", "XL"],
        "isSale": "true",
    },
    {
        "id": "8",
        "name": "Athletic Running Shoes",
        "price": "110.0",
        "image": "/placeholder.svg?height=400&width=300",
        "category": "Shoes",
        "brand": "SportMax",
        "rating": "4.4",
        "reviews": "203",
        "colors": ["Black", "White", "Blue"],
        "sizes": ["6", "7", "8", "9", "10", "11", "12"],
        "isNew": "true",
    },
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

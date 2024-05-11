## Tenant Onboarding Process 

1. Create a new Tenant in the database. Fill the details in the below JSON format and call `/create-tenant` endpoint using Postman.

    ```
    
    ```
    
2. Create a User with admin access for the Tenant. 
     
    Method 1:
    Fill the details in the below JSON format and call `/create-user` endpoint using Postman.

    ```json
    {
        "username": "user",
        "password": "password",
        "confirmPassword": "password",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@gmail.com",
        "mobileNo": "1234567890",
        "address": "57, 58 Newyork Street",
        "tenantId": "65db6adc4179970e65c7fd54",
        "status": "approved"
    }
    ```
    
    Method 2: 
    Directly from the registration page selecting Admin as user type. In this case the superadmin needs to manually mark new admin status as `approved` in the Database, to successfully able to login.
    
3. Create all ingredients with the required details in the JSON format as an array of JSON Objects.

    ```json
    [
      {
        "name": "Brown Sugar",
        "category": "Condiments",
        "inventory": 20,
        "invUnit": "lb",
        "avgCost": 12,
        "lastPurchasePrice": 12,
        "medianPurchasePrice": 12,
        "threshold": 10,
        "tenantId": {
          "$oid": "65db6adc4179970e65c7fd54"
        }
      }
    ]
    ```
    
    Ingredients can be stored in database by directly importing the JSON in file in MongoDb Compass, or by calling the api endpoint `create-ingredient` through Postman.
  
4. Create Unitmappings for all ingredients with the required details in the JSON format as an array of JSON Objects.
    
    ```json
    [
      {
        "ingredient_id": {
          "$oid": "66379f6e9baff844cf575bbb"
        },
        "name": "Brown Sugar",
        "fromUnit": [
          {
            "unit": "tsp",
            "conversion": 0.16
          },
          {
            "unit": "tbsp",
            "conversion": 0.5
          },
          {
            "unit": "cup",
            "conversion": 8
          },
          {
            "unit": "oz",
            "conversion": 1
          },
          {
            "unit": "lb",
            "conversion": 16
          }
        ],
        "toUnit": "oz",
        "description": "standard unit is oz",
        "tenantId": {
          "$oid": "66372e76eaeab339d4bb241a"
        }
      }
    ]
    ```

    Unitmaps can be stored in database by directly importing the JSON in file in MongoDb Compass, or by calling the api endpoint `create-unitmap` through Postman.
    
5. Create Recipe categories like Food and Beverage, and also there sub-categories in the below JSON format.
    
    ```json
    [
      {
        "type": "Food",
        "subType": "Rolls",
        "imageUrl": "",
        "tenantId": {
          "$oid": "65db6adc4179970e65c7fd54"
        }
      },
      {
        "type": "Beverage",
        "subType": "Shakes",
        "imageUrl": "",
        "tenantId": {
          "$oid": "65db6adc4179970e65c7fd54"
        }
      }
    ]
    ```

    Types can be stored in database by directly importing the JSON in file in MongoDb Compass, or by calling the api endpoint `create-unitmap` through Postman.
    
6. Create Recipes, that can be created directly from the platform's Menu Builder.

7. Rest all the processes can be done directly on the platform.
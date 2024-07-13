## Curso de NextJS de Fernando Herrera  

### TesloShop App  

**Instalar dependencias:**  
```npm install```  

**Iniciar el proyecto:**  
```npm run dev```

Para correr localmente, se necesita la base de datos  
```
docker-compose up -d
```  
  
* El -d significa __detached__  

MongoDB URL Local:  
```
mongodb://localhost:27017/teslodb
```  

## Variables de entorno  
Crear archivop __.env__ en la raiz del proyecto con las siguientes variables:  
```  
HOST_NAME
MONGO_URL
JWT_SECRET_SEED
NEXT_PUBLIC_TAX_RATE
NEXTAUTH_URL
NEXTAUTH_SECRET
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
NEXT_PUBLIC_PAYPAL_CLIENT_ID
PAYPAL_SECRET
PAYPAL_OAUTH_URL
PAYPAL_ORDERS_URL
CLOUDINARY_URL 
```  
## Llenar la base de datos con informaion de prueba  
Llamar a:  
```[http](http://localhost:4000/api/seed)```
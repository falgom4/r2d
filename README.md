# R2Drive 🚀

Gestor de archivos web para buckets **Cloudflare R2**, con diseño minimalista y tema oscuro.

## 🌟 Características

- 🔐 **Seguridad primero**: Credenciales solo en memoria, nunca se guardan
- 📁 **Navegación completa**: Explora carpetas y archivos en tu bucket R2
- ✨ **CRUD completo**: Crea, lee, actualiza y elimina archivos y carpetas
- 📤 **Upload inteligente**: Multipart upload para archivos grandes con barra de progreso
- 🖼️ **Preview de imágenes**: Visualiza imágenes directamente en el navegador
- 🎨 **Diseño minimalista**: Tema oscuro moderno y limpio
- ⚡ **Rápido y ligero**: Built con Vite y React
- ☁️ **Deploy sencillo**: Listo para Cloudflare Pages

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18 o superior
- Un bucket R2 en Cloudflare
- Credenciales R2 (Access Key ID y Secret Access Key)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/r2d.git
cd r2d

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
npm run build
```

Los archivos de producción se generarán en `dist/`

## 📋 Cómo Usar

1. **Abrir la aplicación**: Al cargar, verás un modal solicitando tus credenciales R2
2. **Ingresar credenciales**:
   - **Account ID**: Tu Cloudflare Account ID
   - **Access Key ID**: Tu R2 Access Key ID
   - **Secret Access Key**: Tu R2 Secret Access Key
   - **Bucket Name**: Nombre del bucket que deseas gestionar
3. **Navegar**: Una vez conectado, podrás:
   - Ver archivos y carpetas
   - Navegar entre carpetas con doble clic
   - Crear nuevas carpetas
   - Subir archivos (drag & drop o botón)
   - Descargar archivos
   - Eliminar archivos y carpetas
   - Ver preview de imágenes

## 🔐 Seguridad

### Credenciales
- **NUNCA se guardan**: Las credenciales solo existen en memoria (React Context)
- **Sin localStorage**: No se persisten en el navegador
- **Sin servidor**: No se envían a ningún servidor
- **Sesión temporal**: Se pierden al cerrar/recargar la página

### Recomendaciones
- Usa credenciales R2 con permisos limitados
- Configura CORS en tu bucket R2 para permitir acceso desde tu dominio
- Considera usar credenciales de solo lectura si no necesitas modificar archivos

### Configuración CORS en R2

Tu bucket R2 debe tener la siguiente configuración CORS:

```json
[
  {
    "AllowedOrigins": ["https://tu-dominio.pages.dev"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

## 🌐 Deploy en Cloudflare Pages

1. **Conectar repositorio a Cloudflare Pages**:
   - Ve a Cloudflare Dashboard → Pages
   - "Create a project" → "Connect to Git"
   - Selecciona tu repositorio

2. **Configuración de build**:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`

3. **Variables de entorno**: No son necesarias (credenciales en cliente)

4. **Deploy**: Cada push a `main` desplegará automáticamente

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: TailwindCSS 3
- **R2 Integration**: AWS SDK v3 (`@aws-sdk/client-s3`)
- **Iconos**: Lucide React
- **Upload**: React Dropzone + AWS Multipart Upload
- **Formateo**: date-fns

## 📁 Estructura del Proyecto

```
r2d/
├── src/
│   ├── components/      # Componentes React
│   ├── context/         # React Contexts (Auth, R2, UI)
│   ├── hooks/           # Custom Hooks
│   ├── services/        # Servicios R2 (API S3)
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades
│   └── styles/          # Estilos globales
├── public/
│   ├── _redirects       # SPA routing
│   └── _headers         # Security headers
└── ...
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: Add AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 🙏 Agradecimientos

- [Cloudflare R2](https://www.cloudflare.com/products/r2/) por el almacenamiento object storage
- [AWS SDK](https://aws.amazon.com/sdk-for-javascript/) por la compatibilidad S3
- [TailwindCSS](https://tailwindcss.com/) por el sistema de diseño
- [Lucide](https://lucide.dev/) por los iconos

---

Hecho con ❤️ usando React y Cloudflare R2

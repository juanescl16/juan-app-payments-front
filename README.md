# 💳 Payment App - Frontend

Frontend de la aplicación de pagos construida como parte de una prueba técnica, integrado con Wompi.  
Desarrollado con **Vue 3**, **TypeScript**, **Vite** y **Tailwind CSS**.

---

## ⚙️ Tecnologías utilizadas

- **Vue 3** (Composition API)
- **TypeScript**
- **Vite**
- **Pinia** (manejo de estado)
- **Tailwind CSS** (estilos)
- **Axios** (consumo de API)

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/juanescl16/juan-app-payments-front.git
cd juan-app-payments-front

Instalar dependencias

npm install

Copia el archivo .env.template como .env y ajusta la URL del backend

Ejecutar en desarrollo

npm run dev

Estructura del proyecto

src/
├── components/          # Componentes reutilizables
├── views/               # Vistas principales (pantallas)
├── store/               # Pinia stores (estado)
├── services/            # Módulos para llamadas HTTP
├── router/              # Rutas de la aplicación
├── assets/              # Imágenes y estilos globales
├── App.vue              # Componente raíz
├── main.ts              # Punto de entrada


Funcionalidades implementadas:

Formulario de compra con validación
Selección de producto desde API
Integración con backend para crear y pagar transacciones
Gestión de estados de carga, error y éxito
Estilos responsive con Tailwind
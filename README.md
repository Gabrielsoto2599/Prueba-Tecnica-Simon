# 🚀 Soto System - Registro Maestro B2B (Technical Test)

Proyecto desarrollado para la prueba técnica de 48 horas. Se migró de un stack legado (ASP.NET 2015) a un entorno moderno con **Next.js 15+** y **Tailwind CSS**, priorizando la escalabilidad y una UI de alto impacto.

## 🛠️ Stack Tecnológico
- **Frontend:** Next.js (App Router), TypeScript.
- **Estilos:** Tailwind CSS (Arquitectura de diseño personalizada "Soto System").
- **Persistencia:** Sistema híbrido de `LocalStorage` y `JSON File System` (Debido a tiempos de entrega y optimización de entorno).
- **Reportes:** Integración de `jsPDF` para generación de expedientes técnicos.

## 🌟 Características Principales
1. **CRUD Completo:** Gestión total de registros de clientes.
2. **Seguridad:** Validación de acceso mediante Cookies de sesión.
3. **UX Pro:** Implementación de Tooltips de asistencia en todos los campos (Requerimiento #8).
4. **Filtro Inteligente:** Búsqueda reactiva por Nombre o ID.
5. **Reporte Maestro:** Exportación a PDF con branding corporativo.

## ⚙️ Instalación
1. Clonar el repositorio.
2. Ejecutar `npm install` para reconstruir las dependencias.
3. Ejecutar `npm run dev` para encender el motor del sistema.

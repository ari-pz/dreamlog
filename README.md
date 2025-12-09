# 🌙 Dreamlog
**Dreamlog** es una plataforma para registrar y organizar tus sueños recientes. Funciona como un diario personal de sueños, permitiendo mantener un historial, clasificarlos mediante etiquetas y consultarlos cuando quieras. 



## 📖 Descripción 
Dreamlog permite a los usuarios:
- Registrar sueños recientes de forma rápida y sencilla.  
- Mantener un historial personal de sueños.  
- Clasificar y organizar los sueños mediante etiquetas. 
- Consultar y reflexionar sobre los sueños anteriores.
Es ideal para quienes quieren llevar un diario de sueños, reflexionar sobre ellos o simplemente no olvidarlos.


## 👤 Integrantes
- [Magali Karen Huertas](https://github.com/mhuertas269)
- [Brenda Choque](https://github.com/Bren-Ch)
- [Arianna Perez Ochoa](https://github.com/ari-pz)


## ⭐ Requisitos previos
Antes de levantar el proyecto, asegurate de tener instalados:
- [Node.js](https://nodejs.org/) (v18 o superior)  
- [npm](https://www.npmjs.com/)  
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)  


## 🛠️ Instalación
1. **Clonar el repositorio**
```bash
git clone git@github.com:ari-pz/dreamlog.git
```
2. **Instalar dependencias del backend**
```bash
cd dreamlog
cd backend
npm install
```
3. **Levantar la base de datos y el Backend**
```bash
cd ..
make dev
```

**Otros comandos útiles**
```bash
# Detener los contenedores de Docker
make stop-db

# Reiniciar la base de datos y volver a levantar todo
make restart-db

# Limpiar la base de datos completamente (borra volúmenes)
make clean-db-volumes

# Correr solo el backend sin nodemon
make start-backend
```


---

## 📸 Capturas de pantalla
- Iniciar Sesión / Registrarse
- Pantalla de Inicio
- Perfil de Usuario

**Usar solo 1 vez**
cd backend
docker compose down -v
docker volume rm dreamlog-db || true
docker compose up -d



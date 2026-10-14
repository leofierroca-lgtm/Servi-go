-- Base de Datos para Servi-Go (Directorio Digital Yaguará)
-- Puedes importar este archivo directamente en Laragon (usando phpMyAdmin, HeidiSQL o la consola de MySQL)

CREATE DATABASE IF NOT EXISTS `directorio_digital` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `directorio_digital`;

-- 1. Tabla de Usuarios (Autenticación y Roles)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('client', 'provider', 'admin') DEFAULT 'client',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabla de Categorías (Los rubros del directorio)
CREATE TABLE `categories` (
  `id` VARCHAR(50) PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL,
  `icon` VARCHAR(50) DEFAULT NULL
);

-- 3. Tabla de Negocios / Proveedores (Los perfiles que se muestran en las tarjetas)
CREATE TABLE `businesses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `type` ENUM('service', 'commerce') NOT NULL, -- Si es un servicio o un comercio de productos
  `description` TEXT,
  `location` VARCHAR(100) NOT NULL DEFAULT 'Yaguará',
  `address` VARCHAR(200),
  `phone` VARCHAR(20),
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `reviews_count` INT DEFAULT 0,
  `response_time` VARCHAR(50) DEFAULT 'En minutos',
  `verified` BOOLEAN DEFAULT FALSE,
  `avatar` VARCHAR(255),
  `image_banner` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT
);

-- 4. Tabla de Productos y Servicios (El Menú o Catálogo de cada perfil)
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `business_id` INT NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(50), -- ej. unidad, porción, hora, litro
  `image` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
);

-- 5. Tabla de Reseñas (Para las calificaciones con estrellas)
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `business_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

-- 6. Tabla de Mensajes (Para el sistema de Chat)
CREATE TABLE `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `business_id` INT, -- Opcional: para saber sobre qué negocio están hablando
  `content` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE SET NULL
);

-- ==========================================
-- DATOS DE PRUEBA INICIALES (MOCK DATA)
-- ==========================================

-- Insertar Categorías principales solicitadas
INSERT INTO `categories` (`id`, `label`, `icon`) VALUES
('comidas_tipicas', 'Comidas Típicas & Quesillos', 'Utensils'),
('electricistas', 'Electricistas', 'Zap'),
('transporte', 'Transporte', 'Truck'),
('droguerias', 'Droguerías', 'Pill'),
('domicilios', 'Domicilios', 'Bike'),
('acarreos', 'Acarreos y Mudanzas', 'Package'),
('maestros', 'Maestros de Obra', 'HardHat'),
('tecnologia', 'Tecnología y Telefonía', 'Smartphone'),
('belleza', 'Belleza y Estética', 'Scissors');

-- Insertar un Usuario Administrador de prueba y proveedores
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Administrador Yaguará', 'admin@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Budaphone', 'budaphone@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider'),
('Comercio 2', 'comercio2@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider'),
('Comercio 3', 'comercio3@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider'),
('Comercio 4', 'comercio4@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider'),
('Comercio 5', 'comercio5@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider'),
('Servicio Uñas', 'unas@servigo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'provider');

-- Insertar 5 comercios y 1 servicio
INSERT INTO `businesses` (`user_id`, `category_id`, `name`, `type`, `description`, `location`, `phone`, `verified`, `image_banner`) VALUES
(2, 'tecnologia', 'Budaphone', 'commerce', 'Servicio Técnico Especializado y Accesorios Móviles. Diagnóstico en 24 horas. Repara con nosotros es muy fácil!', 'Yaguará', '3144618379', 1, 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?auto=format&fit=crop&q=80&w=400'),
(3, 'comidas_tipicas', 'Comercio 2 (Pendiente)', 'commerce', 'Espacio reservado para el comercio 2.', 'Yaguará', '', 0, NULL),
(4, 'droguerias', 'Comercio 3 (Pendiente)', 'commerce', 'Espacio reservado para el comercio 3.', 'Yaguará', '', 0, NULL),
(5, 'acarreos', 'Comercio 4 (Pendiente)', 'commerce', 'Espacio reservado para el comercio 4.', 'Yaguará', '', 0, NULL),
(6, 'domicilios', 'Comercio 5 (Pendiente)', 'commerce', 'Espacio reservado para el comercio 5.', 'Yaguará', '', 0, NULL),
(7, 'belleza', 'Servicio de Maquillaje de Uñas (Pendiente)', 'service', 'Espacio reservado para el servicio de uñas y demás.', 'Yaguará', '', 0, NULL);

-- Insertar Productos de Ejemplo para Budaphone
INSERT INTO `products` (`business_id`, `name`, `description`, `price`, `unit`) VALUES
(1, 'Diagnóstico de Celular', 'Diagnóstico en 24 horas', 10000.00, 'servicio'),
(1, 'Accesorios para Celulares', 'Cables, cargadores, audífonos', 15000.00, 'unidad');

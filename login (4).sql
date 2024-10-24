-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-10-2024 a las 20:35:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `login`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` int(50) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `descripcion` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `categoria`, `descripcion`) VALUES
(1, 'plastico', 'El plástico es un material sintético que se obtiene mediante reacciones de polimerización de derivados del petróleo. Son materiales orgánicos, impermeables, resistentes y buenos aislantes. Es importante verificar la información con fuentes confiables.'),
(2, 'Alimentos', 'Los alimentos son sustancias complejas que proporcionan los nutrientes necesarios para mantener las funciones vitales del cuerpo. Pueden ser de origen vegetal, animal o fúngico y contienen elementos esenciales como carbohidratos, grasas, proteínas, vitaminas y minerales.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `id_usuario` int(50) NOT NULL,
  `total_compra` decimal(50,2) NOT NULL,
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id_compra`, `id_usuario`, `total_compra`, `fecha`) VALUES
(1, 3, 15.00, '2024-09-20 23:35:05'),
(2, 2, 25.00, '2024-10-07 17:38:39'),
(3, 2, 750.00, '2024-10-08 09:49:35'),
(4, 2, 950.00, '2024-10-08 09:50:49');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_ingresos`
--

CREATE TABLE `historial_ingresos` (
  `id` int(50) NOT NULL,
  `id_usuario` int(50) NOT NULL,
  `fecha` datetime NOT NULL,
  `codigo` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_ingresos`
--

INSERT INTO `historial_ingresos` (`id`, `id_usuario`, `fecha`, `codigo`) VALUES
(1, 1, '2024-08-06 15:31:11', '24fgfdhgfdhgfdhd'),
(2, 2, '2024-08-17 21:52:14', 'd8a638b1'),
(3, 2, '2024-08-17 23:13:33', '435f7fd519f618e4'),
(4, 3, '2024-08-24 00:06:55', '994fc2842660e804'),
(5, 3, '2024-08-24 12:42:20', '59bccf346d7ae25e'),
(6, 3, '2024-08-24 12:43:43', 'df53b3bd19244ca7'),
(7, 3, '2024-08-24 12:53:37', '19e227ef6a463a85'),
(8, 3, '2024-08-24 13:12:50', 'a4035622cc989068'),
(9, 3, '2024-08-25 15:14:21', '853aa34d25eda16b'),
(10, 3, '2024-08-25 15:56:17', '6802c5076998ac73'),
(11, 3, '2024-09-22 13:57:47', '22a64e029c7afca9'),
(12, 3, '2024-10-03 14:48:57', '877afcbb5f12c04f'),
(13, 3, '2024-10-24 11:54:03', 'be050fa7911a0521'),
(14, 3, '2024-10-24 11:59:33', '2a97e06c27ad1220'),
(15, 3, '2024-10-24 11:59:45', '379a5f711f6458ed');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `id` int(50) NOT NULL,
  `permiso` enum('create','read','delete','update') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `permisos`
--

INSERT INTO `permisos` (`id`, `permiso`) VALUES
(1, 'create'),
(2, 'read'),
(3, 'delete'),
(4, 'update');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(50) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `nombre_producto` varchar(250) NOT NULL,
  `descripcion` varchar(5075) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(50) NOT NULL,
  `id_categoria` int(50) NOT NULL,
  `activo` enum('activo','inactivo') NOT NULL,
  `id_proveedor` int(50) NOT NULL,
  `imagen` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo`, `nombre_producto`, `descripcion`, `precio`, `stock`, `id_categoria`, `activo`, `id_proveedor`, `imagen`) VALUES
(1, '001', 'carne', 'es una carne', 200.00, 0, 2, 'activo', 1, '0'),
(2, '002', 'carne', 'es una carne', 200.00, 8, 2, 'activo', 1, '0'),
(3, '000C7276', 'cama', 'es una cama', 150.00, 15, 1, 'activo', 1, '0'),
(12, '684C98ED', 'zapato1', 'es una cama', 1000.00, 15, 1, 'activo', 1, '0'),
(13, '684C98ED', 'zapato1', 'es una cama', 1000.00, 15, 1, 'activo', 1, '0'),
(14, 'F5C143B5', 'zapato2', 'es una cama', 800.00, 20, 1, 'activo', 1, '0'),
(15, '3FE1D4DA', 'colchon', 'es una colchon', 1230.00, 15, 1, 'activo', 1, '0'),
(16, '2CF7AB4A', 'regla ', 'es una regla', 1230.00, 15, 1, 'activo', 1, '0'),
(17, 'BF46A710', 'impresora epson', 'impresora para trabajar h', 1340.00, 20, 1, 'activo', 1, '0'),
(18, '2CF7AB4A', 'regla ', 'es una regla', 1230.00, 15, 1, 'activo', 1, '0'),
(21, 'E153330F', 'fdsfds', 'dfsdfds', 1.00, 1, 1, 'activo', 1, '/uploads/1729538722467-73072277.jpg'),
(22, '7BBB7CD3', 'sadsadsadsa', 'sadsa', 3423.00, 2323, 1, 'activo', 1, '/uploads/1729538833189-315960094.png'),
(23, '1282692D', 'rdsarfdsf', 'dsfsdf', 342.00, 231, 1, 'activo', 1, '/uploads/1729538833190-524627387.jpg'),
(24, '7B98121F', 'victor', 'victor', 1.00, 1, 1, 'activo', 1, '/uploads/1729539943837-869928293.jpg'),
(25, 'A346B2E3', 'aaaa', 'aaaaa', 1.00, 1, 1, 'activo', 1, '/uploads/1729539943841-859447298.webp'),
(28, '1B69D990', 'Product1', 'Description1', 10.99, 100, 1, 'activo', 1, ''),
(29, 'C9448B0D', 'Product2', 'Description2', 15.50, 200, 1, 'activo', 1, ''),
(30, 'A86AC45B', 'dsfds', 'sdfds', 43534.00, 3453, 1, 'activo', 1, '/uploads/1729613256837-263094446.jpg'),
(32, 'F2AA6A1E', 'fretefdf', 'fdsgd', 1.00, 1, 1, 'activo', 1, ''),
(33, '6B6029C6', 'sauyl', 'saul', 10.00, 10, 1, 'activo', 1, ''),
(34, '4B2DCC07', 'dsafdsaf', 'fdsfds', 1.00, 1, 1, 'activo', 1, ''),
(35, 'F704CA27', 'deadpool', 'sadasdas', 1.00, 1, 1, 'activo', 1, ''),
(36, '2D39F641', 'disco duro', 'es un disco', 543.00, 1, 1, 'activo', 1, ''),
(37, 'C48A4A99', 'aaaaaaaaaaaaaaaa', 'aaaaa', 1.00, 1, 1, 'activo', 1, '/uploads/1729712618589-370027528.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_compras`
--

CREATE TABLE `productos_compras` (
  `id` int(11) NOT NULL,
  `id_compra` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos_compras`
--

INSERT INTO `productos_compras` (`id`, `id_compra`, `id_producto`, `cantidad`, `precio`) VALUES
(1, 1, 2, 10, 200.00),
(2, 1, 1, 10, 150.00),
(3, 2, 1, 20, 200.00),
(4, 2, 13, 10, 100.00),
(5, 3, 1, 5, 150.00),
(6, 4, 1, 5, 150.00),
(7, 4, 2, 2, 100.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_proveedor` int(50) NOT NULL,
  `codigo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(5000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_proveedor`, `codigo`, `nombre`, `direccion`) VALUES
(1, '001', 'victor ca.', 'dsafdsdafsdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(250) NOT NULL,
  `rol` varchar(250) NOT NULL,
  `created_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `rol`, `created_at`) VALUES
(1, 'admin', '2024-10-24'),
(2, 'manager', '2024-10-24'),
(3, 'employee', '2024-10-08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permiso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permiso_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(50) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `apellido` varchar(250) DEFAULT NULL,
  `cedula` varchar(250) DEFAULT NULL,
  `correo` varchar(250) DEFAULT NULL,
  `contraseña` varchar(250) DEFAULT NULL,
  `rol` int(50) NOT NULL,
  `imagen` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido`, `cedula`, `correo`, `contraseña`, `rol`, `imagen`) VALUES
(1, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '27119364', 1, ''),
(2, 'edimary', 'parra', '1234567', 'edir@gmail.com', '$2b$10$M2c0dcYswWGrqLdocAcTheeLUYkdSYrpED.oCL3KiNmM8KGoisNmC', 1, ''),
(3, 'mirlangel', 'cortez', '28098765', 'mirla@gmail.com', '$2b$10$hrCmVUKGh9io79wOCWo6IekWw7PzfvTBFkdBzjXE4aN.NBlvDRxBu', 1, ''),
(5, 'mirlangel', 'cortez', '28098763', 'mirla@gmail.com', '$2b$10$aQ2RLU6eGod0FSqI5QiXguoPGbrkCAAsl5LtdHMyLbbNbiDiF9noW', 1, ''),
(6, 'mirlangel', 'cortez', '28098753', 'mirla@gmail.com', '$2b$10$.nm9yS.4lF74GY3PofCnR.k8TElvOlEBNcupHs8gMzyLykfPbYOjm', 1, ''),
(7, 'mirlangel', 'cortez', '28098743', 'mirla@gmail.com', '$2b$10$MHOBNY7TZd8IvjfJoy6ZNOWInTKtanfODa9ez94lHwfK2T/e9CXre', 1, ''),
(8, 'julio', 'linarez', '28250543', 'julio@gmail.com', '$2b$10$aDfl7oXGpqBMUSp/mDM5oOC2gEd6yiX33MvzUaJYaH8qV1dTjleg.', 1, ''),
(9, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$B5hgQvKGwC6fR5JS1K8BGOj5Fu832DRWTgCUqmCTIF6oWXT03KmGi', 1, NULL),
(10, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$B5hgQvKGwC6fR5JS1K8BGOj5Fu832DRWTgCUqmCTIF6oWXT03KmGi', 1, NULL),
(12, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$W0rQMvX.DZZmqGjTDqWKMOc873RyH2NCXV.68KRpA..uRQiMgTlAi', 1, NULL),
(13, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$W0rQMvX.DZZmqGjTDqWKMOc873RyH2NCXV.68KRpA..uRQiMgTlAi', 1, NULL),
(14, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$DfLsB0EFX3BxJ67wlxkqceDrvcCOZubJzNUdMZi.KS3LNfKnHTmFq', 1, NULL),
(18, 'Roxana', 'camacaro', '178364792', 'victor@gmail.com', '$2b$10$J8cUtCiDtAXewseFA2gTUecCRs./cYEBDCba1j4rUwIjPXwDJ0PNK', 1, NULL),
(19, 'Roxana', 'camacaro', '178364792', 'victor@gmail.com', '$2b$10$J8cUtCiDtAXewseFA2gTUecCRs./cYEBDCba1j4rUwIjPXwDJ0PNK', 1, NULL),
(20, 'maria', '', '17564839', 'victor@gmail.com', '$2b$10$Yr2b2geINw9NBE.cdYa6lexDoEPj4OBC3mclCx0KACdIETId.xNfW', 1, NULL),
(53, 'Victor Camacaro', NULL, NULL, 'victorcamacaro253@gmail.com', NULL, 1, NULL),
(57, 'Victor Manuel Camacaro', NULL, NULL, 'elpikitiki4@gmail.com', NULL, 1, 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=9059991824015203&height=50&width=50&ext=1730224038&hash=AbZ7dJFwbdWIA3ymyI_dsJqZ'),
(59, 'Victor C', NULL, NULL, 'victorcamacaro253@gmail.com', NULL, 1, 'https://avatars.githubusercontent.com/u/74551928?v=4');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `fk{_usuario_l` (`id_usuario`);

--
-- Indices de la tabla `historial_ingresos`
--
ALTER TABLE `historial_ingresos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_id_usuario` (`id_usuario`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_permiso` (`permiso`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_id_categoria` (`id_categoria`),
  ADD KEY `fk_id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `productos_compras`
--
ALTER TABLE `productos_compras`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_compra` (`id_compra`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `unique_rol` (`rol`);

--
-- Indices de la tabla `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permiso_id`),
  ADD KEY `permiso_id` (`permiso_id`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_rol` (`rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_categoria` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `historial_ingresos`
--
ALTER TABLE `historial_ingresos`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `permisos`
--
ALTER TABLE `permisos`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `productos_compras`
--
ALTER TABLE `productos_compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(250) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_id_categoria` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  ADD CONSTRAINT `fk_id_proveedor` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`);

--
-- Filtros para la tabla `productos_compras`
--
ALTER TABLE `productos_compras`
  ADD CONSTRAINT `productos_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  ADD CONSTRAINT `productos_compras_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_rol` FOREIGN KEY (`rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

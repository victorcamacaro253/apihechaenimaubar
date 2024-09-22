-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-09-2024 a las 05:37:11
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
-- Base de datos: `victor`
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
  `fecha` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id_compra`, `id_usuario`, `fecha`) VALUES
(1, 3, '2024-09-20 23:35:05');

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
(10, 3, '2024-08-25 15:56:17', '6802c5076998ac73');

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
  `id_proveedor` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `codigo`, `nombre_producto`, `descripcion`, `precio`, `stock`, `id_categoria`, `activo`, `id_proveedor`) VALUES
(1, '001', 'carne', 'es una carne', 200.00, 10, 2, 'activo', 1),
(2, '002', 'carne', 'es una carne', 200.00, 10, 2, 'activo', 1),
(3, '000C7276', 'cama', 'es una cama', 150.00, 15, 1, 'activo', 1),
(4, '9847FCEE', 'zapato', 'es una cama', 150.00, 15, 1, 'activo', 1),
(5, 'EF647CAD', 'zapato1', 'es una cama', 150.00, 15, 1, 'activo', 1),
(6, 'E2A247B7', 'zapato2', 'es una cama', 150.00, 20, 1, 'activo', 1),
(7, 'DF80AF3D', 'zapato3', 'es una cama', 150.00, 205, 1, 'activo', 1),
(8, '3A9E991C', 'zapato4', 'es una cama', 150.00, 205, 1, 'activo', 1);

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
(2, 1, 1, 10, 150.00);

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
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(50) NOT NULL,
  `nombre` varchar(250) NOT NULL,
  `apellido` varchar(250) NOT NULL,
  `cedula` varchar(250) NOT NULL,
  `correo` varchar(250) NOT NULL,
  `contraseña` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido`, `cedula`, `correo`, `contraseña`) VALUES
(1, 'victor', 'camacaro', '27119364', 'victor@gmail.com', '27119364'),
(2, 'edimary', 'parra', '1234567', 'edir@gmail.com', '$2b$10$M2c0dcYswWGrqLdocAcTheeLUYkdSYrpED.oCL3KiNmM8KGoisNmC'),
(3, 'mirlangel', 'cortez', '28098765', 'mirla@gmail.com', '$2b$10$hrCmVUKGh9io79wOCWo6IekWw7PzfvTBFkdBzjXE4aN.NBlvDRxBu'),
(4, 'mirlangel5', 'cortez', '28098764', 'mirla@gmail.com', '$2b$10$.zu2KjsbSQ/RHQdylh.gZ.Jfs9tl6W1mbN.UOWdZlGdkNBEAb.EZW'),
(5, 'mirlangel', 'cortez', '28098763', 'mirla@gmail.com', '$2b$10$aQ2RLU6eGod0FSqI5QiXguoPGbrkCAAsl5LtdHMyLbbNbiDiF9noW'),
(6, 'mirlangel', 'cortez', '28098753', 'mirla@gmail.com', '$2b$10$.nm9yS.4lF74GY3PofCnR.k8TElvOlEBNcupHs8gMzyLykfPbYOjm'),
(7, 'mirlangel', 'cortez', '28098743', 'mirla@gmail.com', '$2b$10$MHOBNY7TZd8IvjfJoy6ZNOWInTKtanfODa9ez94lHwfK2T/e9CXre');

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
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial_ingresos`
--
ALTER TABLE `historial_ingresos`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `productos_compras`
--
ALTER TABLE `productos_compras`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `fk{_usuario_l` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

--
-- Filtros para la tabla `historial_ingresos`
--
ALTER TABLE `historial_ingresos`
  ADD CONSTRAINT `fk_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-08-2024 a las 20:49:53
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
-- Estructura de tabla para la tabla `historial_ingresos`
--

CREATE TABLE `historial_ingresos` (
  `id` int(50) NOT NULL,
  `id_usuario` int(50) NOT NULL,
  `fecha` date NOT NULL,
  `codigo` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_ingresos`
--

INSERT INTO `historial_ingresos` (`id`, `id_usuario`, `fecha`, `codigo`) VALUES
(1, 34, '2024-08-20', 'e6c4ade40ba1ea90'),
(2, 34, '2024-08-20', '5740b21bc84dc244'),
(3, 34, '2024-08-20', 'fc162ef6e07b39c2'),
(4, 34, '2024-08-21', '0320ee2bbf7227ac'),
(5, 34, '2024-08-21', 'b4944f0ac2611b15'),
(6, 34, '2024-08-21', '860916d2840fe3b1'),
(7, 34, '2024-08-21', '7229cb81792a984f'),
(8, 34, '2024-08-21', '14cd2f81ee3a2fbd'),
(9, 34, '2024-08-21', '401661fe486cc60f'),
(10, 34, '2024-08-21', '9ea8aecd7eb2bb6f'),
(11, 34, '2024-08-21', '33da9df674ed9f6b'),
(12, 34, '2024-08-21', '0bafa575bc73579b'),
(13, 34, '2024-08-21', 'a3deec359a0e8c5e'),
(14, 34, '2024-08-21', '87d29510f7828684'),
(15, 34, '2024-08-21', '17be1184ccf07e09'),
(16, 34, '2024-08-21', '31984840da09ba38'),
(17, 34, '2024-08-21', '15dd5ed7bd895f64'),
(18, 34, '2024-08-21', 'b16bfa792cdebb15'),
(19, 34, '2024-08-21', '9cdf5b1f4849e232'),
(20, 34, '2024-08-21', '39f2bf2dc89a2322'),
(21, 34, '2024-08-21', '98ecd21630acf824'),
(22, 34, '2024-08-21', '190e9b8b77003d91'),
(23, 34, '2024-08-21', '777f229c4c3874de'),
(24, 34, '2024-08-21', '42c4d2eccc8a8df1'),
(25, 34, '2024-08-21', 'fed0f446d0cd1982'),
(26, 34, '2024-08-22', '3155b59ab8cf70e4'),
(27, 34, '2024-08-22', 'a9a898b175ffe713'),
(28, 34, '2024-08-22', '9e2a968b1c5d73d1');

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
(1, '001', 'botella de agua', 'es una botella', 100.00, 20, 1, 'activo', 1),
(2, '002', 'carne', 'es una carne', 200.00, 20, 2, 'activo', 1);

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
(1, '001', 'fddsfsdf', 'dsfds');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(250) NOT NULL,
  `cedula` varchar(30) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id`, `nombre`, `apellido`, `cedula`, `correo`, `contraseña`) VALUES
(2, 'mirlangel', 'cortez', '1234567', 'mirlangel@gmail.com', '$2b$10$l9aZCtjEOY3pABmrcNzAA.NlcfrJ/IbWlTESCC9ltOLauwT55kMne'),
(3, 'edirmary', 'parra', '20365478', 'edirmary@gmail.com', '$2b$10$q/102K.xEr63fReWZDtvzeWLDbIaPzu7HnI8BEfW8y/6FEEJPzn1G'),
(4, 'ander', '', '', 'ander@gmail.com', '1234567'),
(13, 'yohelis', '', '', 'yohelis@gmail.com', '1234567'),
(15, 'victor camacaro', '', '', 'victorcamacaro@gmail.com', '1234567'),
(18, 'jumarit103', '', '', 'jumarit@gmail.com', '$2b$10$rdli/W30eFhYg3F4Q65eGuwNdzVbyH1.s8LlWAjEdG/S52wk5E/06'),
(24, 'jumarit106', '', '', 'jumarit@gmail.com', '$2b$10$lKoAYCEIclStMVU8Jo/TbuEWawDRLGCb.5o48.DrPsIyO.779KLsa'),
(26, 'jumarit112', '', '', 'jumarit@gmail.com', '$2b$10$3UsbwyKU/f68m0SzxzhslO0C7E7ZDTGiidaKiexQtIupyeJW8Lr1W'),
(30, 'jumarit111', '', '', 'jumarit@gmail.com', '$2b$10$j7a8OhpOKevxHnbKE3wJG.LjUYmklR.skptbDurUy9U1kYwgFE4pK'),
(31, 'jumarit112', '', '', 'jumarit@gmail.com', '$2b$10$scSq85JdwQjZTw6kgCcH2u6N55/m/KsYXQt.rY7GCpVWDufe8Hd6u'),
(32, 'edirmary', 'parra', '20365478', 'edirmary@gmail.com', '$2b$10$ZrJcf..P.ZaGSAKolI3CtOWWyh026wC4CK3ycHcA6gOLP1NT6X7n6'),
(34, 'mirlangel', 'cortez', '1234567', 'mirlangel1@gmail.com', '$2b$10$l1MZvbs/4b6ep/7kAgkPuuBJ5uSUSRl9hCTTAXKbmMq0hINs8P7vS'),
(35, 'mirlangel2', 'cortez', '28523697', 'mirlangel1@gmail.com', '$2b$10$seCc2lui.1PI5lLtcl0GxuNQL2P80oDbORX3KM5WXfFgAFWy2SJ9W'),
(36, 'mirlangel2', 'cortez', '285236978', 'mirlangel1@gmail.com', '$2b$10$TAFMY7UnOR.jzmAgR7WqmuQOANPMSKr0RB6wVwnX7crG4DxJeQSoi'),
(37, 'mirlangel3', 'cortez', '2852369456', 'mirlangel1@gmail.com', '$2b$10$zJijVyoDyfLhBSEZ.PBKuednKQaFtZkbtSrthhneRnOkM16dNB9qa'),
(38, 'mirlangel3', 'cortez', '28523694', 'mirlangel1@gmail.com', '$2b$10$0klgOlhL7fYfoG5/SrB2nun6vrFH2H.7dIjwJCE./dDwad7CuMKDC'),
(39, 'luna', 'llena', '7654321', 'mirlangel1@gmail.com', '$2b$10$hE4Lyon.DLr.KuiUXLN2RusGcC51avkAQReL8ag7zE8xj7OEp5zkW');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

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
-- AUTO_INCREMENT de la tabla `historial_ingresos`
--
ALTER TABLE `historial_ingresos`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_proveedor` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- Restricciones para tablas volcadas
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

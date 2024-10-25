-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-10-2024 a las 01:01:02
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
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id` int(50) NOT NULL,
  `google_id` mediumtext DEFAULT NULL,
  `facebook_id` text DEFAULT NULL,
  `github_id` text NOT NULL,
  `twitter_id` text NOT NULL,
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

INSERT INTO `usuario` (`id`, `google_id`, `facebook_id`, `github_id`, `twitter_id`, `nombre`, `apellido`, `cedula`, `correo`, `contraseña`, `rol`, `imagen`) VALUES
(1, '234565', '', '', '', 'victor', 'camacaro', '27119364', 'victor@gmail.com', '27119364', 1, ''),
(2, '0', '', '', '', 'edimary', 'parra', '1234567', 'edir@gmail.com', '$2b$10$M2c0dcYswWGrqLdocAcTheeLUYkdSYrpED.oCL3KiNmM8KGoisNmC', 2, ''),
(3, '0', '', '', '', 'mirlangel', 'cortez', '28098765', 'mirla@gmail.com', '$2b$10$hrCmVUKGh9io79wOCWo6IekWw7PzfvTBFkdBzjXE4aN.NBlvDRxBu', 1, ''),
(4, '0', '', '', '', 'mirlangel5', 'cortez', '28098764', 'mirla@gmail.com', '$2b$10$.zu2KjsbSQ/RHQdylh.gZ.Jfs9tl6W1mbN.UOWdZlGdkNBEAb.EZW', 2, ''),
(5, '0', '', '', '', 'mirlangel', 'cortez', '28098763', 'mirla@gmail.com', '$2b$10$aQ2RLU6eGod0FSqI5QiXguoPGbrkCAAsl5LtdHMyLbbNbiDiF9noW', 1, ''),
(6, '0', '', '', '', 'mirlangel', 'cortez', '28098753', 'mirla@gmail.com', '$2b$10$.nm9yS.4lF74GY3PofCnR.k8TElvOlEBNcupHs8gMzyLykfPbYOjm', 3, ''),
(7, '0', '', '', '', 'mirlangel', 'cortez', '28098743', 'mirla@gmail.com', '$2b$10$MHOBNY7TZd8IvjfJoy6ZNOWInTKtanfODa9ez94lHwfK2T/e9CXre', 1, ''),
(8, '0', '', '', '', 'julio', 'linarez', '28250543', 'julio@gmail.com', '$2b$10$aDfl7oXGpqBMUSp/mDM5oOC2gEd6yiX33MvzUaJYaH8qV1dTjleg.', 1, ''),
(9, '0', '', '', '', 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$B5hgQvKGwC6fR5JS1K8BGOj5Fu832DRWTgCUqmCTIF6oWXT03KmGi', 2, NULL),
(10, '0', '', '', '', 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$B5hgQvKGwC6fR5JS1K8BGOj5Fu832DRWTgCUqmCTIF6oWXT03KmGi', 3, NULL),
(11, '0', '', '', '', 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$Mj9g8JWZuc0AndkoswvChOWCsqQGAEhq/P2Pt5uLf8r6ofN7bWFmK', 1, NULL),
(12, '0', '', '', '', 'victor', 'camacaro', '27119364', '', '$2b$10$W0rQMvX.DZZmqGjTDqWKMOc873RyH2NCXV.68KRpA..uRQiMgTlAi', 0, NULL),
(13, '0', '', '', '', 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$W0rQMvX.DZZmqGjTDqWKMOc873RyH2NCXV.68KRpA..uRQiMgTlAi', 0, NULL),
(14, '0', '', '', '', 'victor', 'camacaro', '27119364', 'victor@gmail.com', '$2b$10$DfLsB0EFX3BxJ67wlxkqceDrvcCOZubJzNUdMZi.KS3LNfKnHTmFq', 0, NULL),
(18, '0', '', '', '', 'Roxana', 'camacaro', '178364792', 'victor@gmail.com', '$2b$10$J8cUtCiDtAXewseFA2gTUecCRs./cYEBDCba1j4rUwIjPXwDJ0PNK', 0, NULL),
(19, '0', '', '', '', 'Roxana', 'camacaro', '178364792', 'victor@gmail.com', '$2b$10$J8cUtCiDtAXewseFA2gTUecCRs./cYEBDCba1j4rUwIjPXwDJ0PNK', 0, NULL),
(20, '0', '', '', '', 'maria', 'zuloaga', '17564839', 'victor@gmail.com', '$2b$10$Yr2b2geINw9NBE.cdYa6lexDoEPj4OBC3mclCx0KACdIETId.xNfW', 0, NULL),
(53, '110035801504866355317', '', '', '', 'Victor Camacaro', NULL, NULL, 'victorcamacaro253@gmail.com', NULL, 0, NULL),
(57, NULL, '9059991824015203', '', '', 'Victor Manuel Camacaro', NULL, NULL, 'elpikitiki4@gmail.com', NULL, 0, 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=9059991824015203&height=50&width=50&ext=1730224038&hash=AbZ7dJFwbdWIA3ymyI_dsJqZ'),
(59, NULL, NULL, '74551928', '', 'Victor C', NULL, NULL, 'victorcamacaro253@gmail.com', NULL, 0, 'https://avatars.githubusercontent.com/u/74551928?v=4'),
(60, NULL, NULL, '', '1311735386134241280', 'Victor Manuel', NULL, NULL, NULL, NULL, 0, 'https://pbs.twimg.com/profile_images/1693121510557319168/b7nl9wgP_normal.jpg'),
(61, NULL, '9059991824015203', '', '', 'Victor Manuel Camacaro', NULL, NULL, 'elpikitiki4@gmail.com', NULL, 0, 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=9059991824015203&height=50&width=50&ext=1732157726&hash=AbaLTTvWHhH6FExbhkuRlzCS');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2025 a las 01:08:16
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hospital`
--
CREATE DATABASE IF NOT EXISTS `hospital` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `hospital`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clasificacion_terapeutica`
--

CREATE TABLE `clasificacion_terapeutica` (
  `idclasificacionterapeutica` int(11) NOT NULL,
  `denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clasificacion_terapeutica`
--

INSERT INTO `clasificacion_terapeutica` (`idclasificacionterapeutica`, `denominacion`) VALUES
(1, 'Analgésicos'),
(10, 'Ansiolíticos'),
(3, 'Antibióticos'),
(8, 'Anticoagulantes'),
(12, 'Anticonvulsivantes'),
(9, 'Antidepresivos'),
(7, 'Antidiabéticos'),
(5, 'Antifúngicos'),
(6, 'Antihipertensivos'),
(2, 'Antiinflamatorios'),
(11, 'Antipsicóticos'),
(4, 'Antivirales'),
(13, 'Broncodilatadores'),
(14, 'Corticoides'),
(15, 'Diuréticos'),
(16, 'Hormonas'),
(18, 'Inmunosupresores'),
(17, 'Quimioterápicos'),
(19, 'Vacunas'),
(20, 'Vitaminas y Minerales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `coberturas`
--

CREATE TABLE `coberturas` (
  `idcobertura` int(11) NOT NULL,
  `denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `coberturas`
--

INSERT INTO `coberturas` (`idcobertura`, `denominacion`) VALUES
(3, 'Galeno'),
(7, 'Hospital Italiano'),
(9, 'IOMA'),
(4, 'Medifé'),
(5, 'Omint'),
(1, 'OSDE'),
(8, 'PAMI'),
(10, 'Particular'),
(6, 'Sancor Salud'),
(2, 'Swiss Medical');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnosticos`
--

CREATE TABLE `diagnosticos` (
  `iddiagnostico` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `categoriamayor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnosticos`
--

INSERT INTO `diagnosticos` (`iddiagnostico`, `codigo`, `descripcion`, `categoria`, `categoriamayor`) VALUES
(1, 'A00', 'Cólera', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(2, 'A01', 'Fiebres tifoidea y paratifoidea', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(3, 'A02', 'Otras infecciones debidas a Salmonella', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(4, 'A03', 'Shigelosis', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(5, 'A04', 'Otras infecciones intestinales bacterianas', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(6, 'A05', 'Otras intoxicaciones alimentarias bacterianas', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(7, 'A06', 'Amebiasis', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(8, 'A07', 'Otras enfermedades intestinales debidas a protozoarios', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(9, 'A08', 'Infecciones intestinales debidas a virus y otros organismos especificados', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(10, 'A09', 'Diarrea y gastroenteritis de presunto origen infeccioso', 'Enfermedades infecciosas intestinales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(11, 'A15', 'Tuberculosis respiratoria, confirmada bacteriológica e histológicamente', 'Tuberculosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(12, 'A16', 'Tuberculosis respiratoria, no confirmada bacteriológica o histológicamente', 'Tuberculosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(13, 'A17', 'Tuberculosis del sistema nervioso', 'Tuberculosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(14, 'A18', 'Tuberculosis de otros órganos', 'Tuberculosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(15, 'A19', 'Tuberculosis miliar', 'Tuberculosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(16, 'A20', 'Peste', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(17, 'A21', 'Tularemia', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(18, 'A22', 'Carbunco [ántrax]', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(19, 'A23', 'Brucelosis', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(20, 'A24', 'Muermo y melioidosis', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(21, 'A25', 'Fiebres por mordedura de rata', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(22, 'A26', 'Erisipeloide', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(23, 'A27', 'Leptospirosis', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(24, 'A28', 'Otras enfermedades zoonóticas bacterianas, no clasificadas en otra parte', 'Ciertas zoonosis bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(25, 'A30', 'Lepra [enfermedad de Hansen]', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(26, 'A31', 'Infecciones debidas a otras micobacterias', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(27, 'A32', 'Listeriosis', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(28, 'A33', 'Tétanos neonatal', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(29, 'A34', 'Tétanos obstétrico', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(30, 'A35', 'Otros tétanos', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(31, 'A36', 'Difteria', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(32, 'A37', 'Tos ferina [tos convulsiva]', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(33, 'A38', 'Escarlatina', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(34, 'A39', 'Infección meningococica', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(35, 'A40', 'Septicemia estreptococica', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(36, 'A41', 'Otras septicemias', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(37, 'A42', 'Actinomicosis', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(38, 'A43', 'Nocardiosis', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(39, 'A44', 'Bartonelosis', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(40, 'A46', 'Erisipela', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(41, 'A48', 'Otras enfermedades bacterianas, no clasificadas en otra parte', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(42, 'A49', 'Infección bacteriana de sitio no especificado', 'Otras enfermedades bacterianas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(43, 'A50', 'Sífilis congénita', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(44, 'A51', 'Sífilis precoz', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(45, 'A52', 'Sífilis tardía', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(46, 'A53', 'Otras sífilis y las no especificadas', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(47, 'A54', 'Infección gonococica', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(48, 'A55', 'Linfogranuloma (venéreo) por clamidias', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(49, 'A56', 'Otras enfermedades de transmisión sexual debidas a clamidias', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(50, 'A57', 'Chancro blando', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(51, 'A58', 'Granuloma inguinal', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(52, 'A59', 'Tricomoniasis', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(53, 'A60', 'Infección anogenital debida a virus del herpes (herpes simple)', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(54, 'A63', 'Otras enfermedades de transmisión predominantemente sexual, no clasificadas en otra parte', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(55, 'A64', 'Enfermedad de transmisión sexual no especificada', 'Infecciones con modo de transmisión predominantemente sexual', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(56, 'A65', 'Sífilis no venérea', 'Otras enfermedades debidas a espiroquetas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(57, 'A66', 'Frambesia', 'Otras enfermedades debidas a espiroquetas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(58, 'A67', 'Pinta [carate]', 'Otras enfermedades debidas a espiroquetas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(59, 'A68', 'Fiebres recurrentes', 'Otras enfermedades debidas a espiroquetas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(60, 'A69', 'Otras infecciones causadas por espiroquetas', 'Otras enfermedades debidas a espiroquetas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(61, 'A70', 'Infección debida a Chlamydia psittaci', 'Otras enfermedades causadas por clamidias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(62, 'A71', 'Tracoma', 'Otras enfermedades causadas por clamidias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(63, 'A74', 'Otras enfermedades causadas por clamidias', 'Otras enfermedades causadas por clamidias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(64, 'A75', 'Tifus', 'Rickettsiosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(65, 'A77', 'Fiebre maculosa (rickettsiosis transmitida por garrapatas)', 'Rickettsiosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(66, 'A78', 'Fiebre Q', 'Rickettsiosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(67, 'A79', 'Otras rickettsiosis', 'Rickettsiosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(68, 'A80', 'Poliomielitis aguda', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(69, 'A81', 'Infecciones del sistema nervioso central por virus lento', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(70, 'A82', 'Rabia', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(71, 'A83', 'Encefalitis viral transmitida por mosquitos', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(72, 'A84', 'Encefalitis viral transmitida por garrapatas', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(73, 'A85', 'Otras encefalitis virales, no clasificadas en otra parte', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(74, 'A86', 'Encefalitis viral, no especificada', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(75, 'A87', 'Meningitis viral', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(76, 'A88', 'Otras infecciones virales del sistema nervioso central, no clasificadas en otra parte', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(77, 'A89', 'Infección viral del sistema nervioso central, no especificada', 'Infecciones virales del sistema nervioso central', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(78, 'A90', 'Fiebre del dengue [dengue clásico]', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(79, 'A91', 'Fiebre del dengue hemorrágico', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(80, 'A92', 'Otras fiebres virales transmitidas por mosquitos', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(81, 'A93', 'Otras fiebres virales transmitidas por artrópodos, no clasificadas en otra parte', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(82, 'A94', 'Fiebre viral transmitida por artrópodos, no especificada', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(83, 'A95', 'Fiebre amarilla', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(84, 'A96', 'Fiebre hemorrágica por arenavirus', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(85, 'A98', 'Otras fiebres virales hemorrágicas, no clasificadas en otra parte', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(86, 'A99', 'Fiebre viral hemorrágica, no especificada', 'Fiebres virales transmitidas por artrópodos y fiebres virales hemorrágicas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(87, 'B00', 'Infecciones herpéticas [herpes simple]', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(88, 'B01', 'Varicela', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(89, 'B02', 'Herpes zoster', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(90, 'B03', 'Viruela', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(91, 'B04', 'Viruela de los monos', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(92, 'B05', 'Sarampión', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(93, 'B06', 'Rubeola [sarampión alemán]', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(94, 'B07', 'Verrugas víricas', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(95, 'B08', 'Otras infecciones víricas caracterizadas por lesiones de la piel y de las membranas mucosas, no clasificadas en otra parte', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(96, 'B09', 'Infección viral no especificada, caracterizada por lesiones de la piel y de las membranas mucosas', 'Infecciones virales caracterizadas por lesiones de la piel y de las membranas mucosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(97, 'B15', 'Hepatitis aguda tipo A', 'Hepatitis viral', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(98, 'B16', 'Hepatitis aguda tipo B', 'Hepatitis viral', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(99, 'B17', 'Otras hepatitis virales agudas', 'Hepatitis viral', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(100, 'B18', 'Hepatitis viral crónica', 'Hepatitis viral', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(101, 'B19', 'Hepatitis viral, sin otra especificación', 'Hepatitis viral', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(102, 'B20', 'Enfermedad por virus de la inmunodeficiencia humana (VIH), resultante en enfermedades infecciosas y parasitarias', 'Enfermedad por virus de la inmunodeficiencia humana (HIV)', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(103, 'B21', 'Enfermedad por virus de la inmunodeficiencia humana (VIH), resultante en tumores malignos', 'Enfermedad por virus de la inmunodeficiencia humana (HIV)', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(104, 'B22', 'Enfermedad por virus de la inmunodeficiencia humana (VIH), resultante en otras enfermedades especificadas', 'Enfermedad por virus de la inmunodeficiencia humana (HIV)', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(105, 'B23', 'Enfermedad por virus de la inmunodeficiencia humana (VIH), resultante en otras afecciones', 'Enfermedad por virus de la inmunodeficiencia humana (HIV)', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(106, 'B24', 'Enfermedad por virus de la inmunodeficiencia humana (VIH), sin otra especificación', 'Enfermedad por virus de la inmunodeficiencia humana (HIV)', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(107, 'B25', 'Enfermedad debida a virus citomegalico', 'Otras enfermedades virales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(108, 'B26', 'Parotiditis infecciosa', 'Otras enfermedades virales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(109, 'B27', 'Mononucleosis infecciosa', 'Otras enfermedades virales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(110, 'B30', 'Conjuntivitis viral', 'Otras enfermedades virales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(111, 'B33', 'Otras enfermedades virales, no clasificadas en otra parte', 'Otras enfermedades virales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(112, 'B34', 'Infección viral de sitio no especificado', 'Otras enfermedades virales', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(113, 'B35', 'Dermatofitosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(114, 'B36', 'Otras micosis superficiales', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(115, 'B37', 'Candidiasis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(116, 'B38', 'Coccidioidomicosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(117, 'B39', 'Histoplasmosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(118, 'B40', 'Blastomicosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(119, 'B41', 'Paracoccidioidomicosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(120, 'B42', 'Esporotricosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(121, 'B43', 'Cromomicosis y absceso feomicotico', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(122, 'B44', 'Aspergilosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(123, 'B45', 'Criptococosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(124, 'B46', 'Cigomicosis', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(125, 'B47', 'Micetoma', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(126, 'B48', 'Otras micosis, no clasificadas en otra parte', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(127, 'B49', 'Micosis, no especificada', 'Micosis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(128, 'B50', 'Paludismo [malaria] debido a Plasmodium falciparum', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(129, 'B51', 'Paludismo [malaria] debido a Plasmodium vivax', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(130, 'B52', 'Paludismo [malaria] debido a Plasmodium malaria', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(131, 'B53', 'Otro paludismo [malaria] confirmado parasitológicamente', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(132, 'B54', 'Paludismo [malaria] no especificado', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(133, 'B55', 'Leishmaniasis', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(134, 'B56', 'Tripanosomiasis africana', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(135, 'B57', 'Enfermedad de Chagas', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(136, 'B58', 'Toxoplasmosis', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(137, 'B59', 'Neumocistosis', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(138, 'B60', 'Otras enfermedades debidas a protozoarios, no clasificadas en otra parte', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(139, 'B64', 'Enfermedad debida a protozoarios, no especificada', 'Enfermedades debidas a protozoarios', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(140, 'B65', 'Esquistosomiasis [bilharziasis]', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(141, 'B66', 'Otras infecciones debidas a tremátodos', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(142, 'B67', 'Equinococosis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(143, 'B68', 'Teniasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(144, 'B69', 'Cisticercosis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(145, 'B70', 'Difilobotriasis y esparganosis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(146, 'B71', 'Otras infecciones debidas a cestodos', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(147, 'B72', 'Dracontiasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(148, 'B73', 'Oncocercosis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(149, 'B74', 'Filariasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(150, 'B75', 'Triquinosis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(151, 'B76', 'Anquilostomiasis y necatoriasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(152, 'B77', 'Ascariasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(153, 'B78', 'Estrongiloidiasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(154, 'B79', 'Tricuriasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(155, 'B80', 'Enterobiasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(156, 'B81', 'Otras helmintiasis intestinales, no clasificadas en otra parte', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(157, 'B82', 'Parasitosis intestinales, sin otra especificación', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(158, 'B83', 'Otras helmintiasis', 'Helmintiasis', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(159, 'B85', 'Pediculosis y pithiriasis', 'Pediculosis. Acariasis y otras manifestaciones', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(160, 'B86', 'Escabiosis', 'Pediculosis. Acariasis y otras manifestaciones', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(161, 'B87', 'Miasis', 'Pediculosis. Acariasis y otras manifestaciones', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(162, 'B88', 'Otras infestaciones', 'Pediculosis. Acariasis y otras manifestaciones', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(163, 'B89', 'Enfermedad parasitaria, no especificada', 'Pediculosis. Acariasis y otras manifestaciones', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(164, 'B90', 'Secuelas de tuberculosis', 'Secuelas de enfermedades infecciosas y parasitarias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(165, 'B91', 'Secuelas de poliomielitis', 'Secuelas de enfermedades infecciosas y parasitarias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(166, 'B92', 'Secuelas de lepra', 'Secuelas de enfermedades infecciosas y parasitarias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(167, 'B94', 'Secuelas de otras enfermedades infecciosas y parasitarias y de las no especificadas', 'Secuelas de enfermedades infecciosas y parasitarias', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(168, 'B95', 'Estreptococos y estafilococos como causa de enfermedades clasificadas en otros capítulos', 'Bacterias, virus y otros agentes infecciosos', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(169, 'B96', 'Otros agentes bacterianos como causa de enfermedades clasificadas en otros capítulos', 'Bacterias, virus y otros agentes infecciosos', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(170, 'B97', 'Agentes virales como causa de enfermedades clasificadas en otros capítulos', 'Bacterias, virus y otros agentes infecciosos', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS'),
(171, 'B99', 'Otras enfermedades infecciosas y las no especificadas', 'Otras enfermedades infecciosas', 'CIERTAS ENFERMEDADES INFECCIOSAS Y PARASITARIAS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermeros`
--

CREATE TABLE `enfermeros` (
  `idenfermero` int(11) NOT NULL,
  `apellidonombres` varchar(100) NOT NULL,
  `matricula` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `enfermeros`
--

INSERT INTO `enfermeros` (`idenfermero`, `apellidonombres`, `matricula`, `telefono`, `email`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'SESTO CAMILO', '255', NULL, NULL, '2025-05-26 12:34:53', '2025-05-26 12:34:53', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `idespecialidad` int(11) NOT NULL,
  `denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`idespecialidad`, `denominacion`) VALUES
(2, 'Alergología'),
(1, 'Anestesiología'),
(3, 'Angiología'),
(39, 'Bioquímica Clínica'),
(4, 'Cardiología'),
(5, 'Cirugía General'),
(6, 'Cirugía Plástica y Estética'),
(7, 'Cirugía Vascular'),
(8, 'Dermatología'),
(9, 'Endocrinología'),
(34, 'Fisiatría'),
(36, 'Flebología'),
(10, 'Gastroenterología'),
(37, 'Gerontología'),
(11, 'Ginecología y Obstetricia'),
(12, 'Hematología'),
(13, 'Infectología'),
(15, 'Medicina de Urgencias'),
(16, 'Medicina Familiar y General'),
(35, 'Medicina Física y Rehabilitación'),
(14, 'Medicina Interna'),
(17, 'Medicina Laboral'),
(18, 'Medicina Preventiva y Salud Pública'),
(19, 'Nefrología'),
(20, 'Neumonología'),
(21, 'Neurología'),
(22, 'Nutrición'),
(23, 'Odontología'),
(25, 'Oftalmología'),
(24, 'Oncología'),
(26, 'Otorrinolaringología'),
(27, 'Pediatría'),
(38, 'Psicología'),
(28, 'Psiquiatría'),
(32, 'Radiología'),
(29, 'Reumatología'),
(33, 'Tocoginecología'),
(30, 'Traumatología y Ortopedia'),
(31, 'Urología');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudios`
--

CREATE TABLE `estudios` (
  `idestudio` int(11) NOT NULL,
  `denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudios`
--

INSERT INTO `estudios` (`idestudio`, `denominacion`) VALUES
(12, 'Análisis de Orina'),
(11, 'Análisis de Sangre (Hemograma, Bioquímica, etc.)'),
(19, 'Angiografía'),
(17, 'Biopsia (de tejidos u órganos)'),
(10, 'Colonoscopia'),
(6, 'Densitometría Ósea'),
(14, 'Ecocardiograma'),
(1, 'Ecografía'),
(7, 'Electrocardiograma (ECG)'),
(8, 'Electroencefalograma (EEG)'),
(9, 'Endoscopia Digestiva Alta'),
(20, 'Estudios de Medicina Nuclear (Gammagrafía, PET-TAC)'),
(15, 'Holter (Monitoreo Cardíaco)'),
(5, 'Mamografía'),
(16, 'Prueba de Esfuerzo (Ergometría)'),
(13, 'Pruebas de Función Pulmonar (Espirometría)'),
(18, 'Punción Lumbar'),
(2, 'Radiografía'),
(4, 'Resonancia Magnética (RMN)'),
(3, 'Tomografía Computarizada (TAC)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `infra_alas`
--

CREATE TABLE `infra_alas` (
  `idala` int(11) NOT NULL,
  `denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `infra_alas`
--

INSERT INTO `infra_alas` (`idala`, `denominacion`) VALUES
(3, 'ALA ESTE'),
(1, 'ALA NORTE'),
(4, 'ALA OESTE'),
(2, 'ALA SUR');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `infra_camas`
--

CREATE TABLE `infra_camas` (
  `idcama` int(11) NOT NULL,
  `idhabitacion` int(11) NOT NULL,
  `numerocama` varchar(10) NOT NULL,
  `higienizada` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `infra_camas`
--

INSERT INTO `infra_camas` (`idcama`, `idhabitacion`, `numerocama`, `higienizada`) VALUES
(1, 1, 'C1', 0),
(2, 1, 'C2', 0),
(3, 2, 'C1', 0),
(4, 2, 'C2', 0),
(5, 3, 'C1', 0),
(6, 3, 'C2', 0),
(7, 4, 'C1', 0),
(8, 4, 'C2', 0),
(9, 5, 'C1', 0),
(10, 5, 'C2', 0),
(11, 6, 'C1', 0),
(12, 6, 'C2', 0),
(13, 7, 'C1', 0),
(14, 7, 'C2', 0),
(15, 8, 'C1', 0),
(16, 8, 'C2', 0),
(17, 9, 'C1', 0),
(18, 9, 'C2', 0),
(19, 10, 'C1', 0),
(20, 10, 'C2', 0),
(21, 11, 'C1', 0),
(22, 11, 'C2', 0),
(23, 12, 'C1', 0),
(24, 12, 'C2', 0),
(25, 13, 'C1', 0),
(26, 13, 'C2', 0),
(27, 14, 'C1', 0),
(28, 14, 'C2', 0),
(29, 15, 'C1', 0),
(30, 15, 'C2', 0),
(31, 16, 'C1', 0),
(32, 16, 'C2', 0),
(33, 17, 'C1', 0),
(34, 17, 'C2', 0),
(35, 18, 'C1', 0),
(36, 18, 'C2', 0),
(37, 19, 'C1', 0),
(38, 19, 'C2', 0),
(39, 20, 'C1', 0),
(40, 20, 'C2', 0),
(41, 21, 'C1', 0),
(42, 21, 'C2', 0),
(43, 22, 'C1', 0),
(44, 22, 'C2', 0),
(45, 23, 'C1', 0),
(46, 23, 'C2', 0),
(47, 24, 'C1', 0),
(48, 24, 'C2', 0),
(49, 25, 'C1', 0),
(50, 25, 'C2', 0),
(51, 26, 'C1', 0),
(52, 26, 'C2', 0),
(53, 27, 'C1', 0),
(54, 27, 'C2', 0),
(55, 28, 'C1', 0),
(56, 28, 'C2', 0),
(57, 29, 'C1', 0),
(58, 29, 'C2', 0),
(59, 30, 'C1', 0),
(60, 30, 'C2', 0),
(61, 31, 'C1', 0),
(62, 31, 'C2', 0),
(63, 32, 'C1', 0),
(64, 32, 'C2', 0),
(65, 33, 'C1', 0),
(66, 33, 'C2', 0),
(67, 34, 'C1', 0),
(68, 34, 'C2', 0),
(69, 35, 'C1', 0),
(70, 35, 'C2', 0),
(71, 36, 'C1', 0),
(72, 36, 'C2', 0),
(73, 37, 'C1', 0),
(74, 37, 'C2', 0),
(75, 38, 'C1', 0),
(76, 38, 'C2', 0),
(77, 39, 'C1', 0),
(78, 39, 'C2', 0),
(79, 40, 'C1', 0),
(80, 40, 'C2', 0),
(81, 41, 'C1', 0),
(82, 41, 'C2', 0),
(83, 42, 'C1', 0),
(84, 42, 'C2', 0),
(85, 43, 'C1', 0),
(86, 43, 'C2', 0),
(87, 44, 'C1', 0),
(88, 44, 'C2', 0),
(89, 45, 'C1', 0),
(90, 45, 'C2', 0),
(91, 46, 'C1', 0),
(92, 46, 'C2', 0),
(93, 47, 'C1', 0),
(94, 47, 'C2', 0),
(95, 48, 'C1', 0),
(96, 48, 'C2', 0),
(97, 49, 'C1', 0),
(98, 49, 'C2', 0),
(99, 50, 'C1', 0),
(100, 50, 'C2', 0),
(101, 51, 'C1', 0),
(102, 51, 'C2', 0),
(103, 52, 'C1', 0),
(104, 52, 'C2', 0),
(105, 53, 'C1', 0),
(106, 53, 'C2', 0),
(107, 54, 'C1', 0),
(108, 54, 'C2', 0),
(109, 55, 'C1', 0),
(110, 55, 'C2', 0),
(111, 56, 'C1', 0),
(112, 56, 'C2', 0),
(113, 57, 'C1', 0),
(114, 57, 'C2', 0),
(115, 58, 'C1', 0),
(116, 58, 'C2', 0),
(117, 59, 'C1', 0),
(118, 59, 'C2', 0),
(119, 60, 'C1', 0),
(120, 60, 'C2', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `infra_habitaciones`
--

CREATE TABLE `infra_habitaciones` (
  `idhabitacion` int(11) NOT NULL,
  `idala` int(11) NOT NULL,
  `idunidad` int(11) NOT NULL,
  `nombrehabitacion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `infra_habitaciones`
--

INSERT INTO `infra_habitaciones` (`idhabitacion`, `idala`, `idunidad`, `nombrehabitacion`) VALUES
(1, 1, 7, 'H1'),
(2, 3, 2, 'H2'),
(3, 4, 6, 'H3'),
(4, 1, 2, 'H4'),
(5, 4, 6, 'H5'),
(6, 1, 7, 'H6'),
(7, 4, 3, 'H7'),
(8, 2, 6, 'H8'),
(9, 3, 6, 'H9'),
(10, 1, 3, 'H10'),
(11, 3, 5, 'H11'),
(12, 3, 3, 'H12'),
(13, 4, 5, 'H13'),
(14, 1, 1, 'H14'),
(15, 4, 7, 'H15'),
(16, 2, 6, 'H16'),
(17, 3, 3, 'H17'),
(18, 2, 2, 'H18'),
(19, 1, 6, 'H19'),
(20, 2, 2, 'H20'),
(21, 4, 7, 'H21'),
(22, 1, 7, 'H22'),
(23, 2, 4, 'H23'),
(24, 2, 6, 'H24'),
(25, 1, 5, 'H25'),
(26, 1, 2, 'H26'),
(27, 1, 2, 'H27'),
(28, 3, 5, 'H28'),
(29, 1, 7, 'H29'),
(30, 1, 5, 'H30'),
(31, 3, 3, 'H31'),
(32, 1, 4, 'H32'),
(33, 3, 1, 'H33'),
(34, 1, 2, 'H34'),
(35, 3, 4, 'H35'),
(36, 3, 8, 'H36'),
(37, 3, 10, 'H37'),
(38, 1, 8, 'H38'),
(39, 2, 8, 'H39'),
(40, 4, 10, 'H40'),
(41, 2, 8, 'H41'),
(42, 3, 10, 'H42'),
(43, 2, 9, 'H43'),
(44, 3, 9, 'H44'),
(45, 2, 8, 'H45'),
(46, 3, 10, 'H46'),
(47, 4, 10, 'H47'),
(48, 2, 10, 'H48'),
(49, 4, 10, 'H49'),
(50, 1, 9, 'H50'),
(51, 4, 9, 'H51'),
(52, 1, 9, 'H52'),
(53, 3, 9, 'H53'),
(54, 1, 8, 'H54'),
(55, 4, 8, 'H55'),
(56, 4, 8, 'H56'),
(57, 1, 10, 'H57'),
(58, 4, 9, 'H58'),
(59, 2, 9, 'H59'),
(60, 2, 9, 'H60');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `infra_unidades`
--

CREATE TABLE `infra_unidades` (
  `idunidad` int(11) NOT NULL,
  `denominacion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `infra_unidades`
--

INSERT INTO `infra_unidades` (`idunidad`, `denominacion`) VALUES
(13, 'Hematología'),
(8, 'Infectología'),
(15, 'Medicina Interna'),
(6, 'Neonatología'),
(9, 'Neurología/Neurocirugía'),
(12, 'Oncología'),
(7, 'Pediatría'),
(14, 'Postoperatorio'),
(11, 'Psiquiatría Aguda'),
(1, 'Terapia Intensiva'),
(10, 'Traumatología'),
(4, 'Unidad Coronaria'),
(2, 'Unidad de Cuidados Intensivos (UCI)'),
(3, 'Unidad de Cuidados Intermedios (UCI)'),
(5, 'Unidad de Quemados');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion`
--

CREATE TABLE `internacion` (
  `idinternacion` int(11) NOT NULL,
  `idorigen` int(11) NOT NULL,
  `idmedico` int(11) NOT NULL,
  `idpaciente` int(11) NOT NULL,
  `iddiagnostico` int(11) NOT NULL,
  `fechaingreso` date NOT NULL,
  `horaingreso` time NOT NULL,
  `observaciones` text DEFAULT NULL,
  `fechaalta` date DEFAULT NULL,
  `idmedicoalta` int(11) DEFAULT NULL,
  `indicaciones` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internacion`
--

INSERT INTO `internacion` (`idinternacion`, `idorigen`, `idmedico`, `idpaciente`, `iddiagnostico`, `fechaingreso`, `horaingreso`, `observaciones`, `fechaalta`, `idmedicoalta`, `indicaciones`, `createdAt`, `updatedAt`) VALUES
(7, 2, 32, 1, 144, '2025-05-23', '12:33:00', '', NULL, NULL, NULL, '2025-05-23 15:33:40', '2025-05-23 15:33:40'),
(8, 2, 18, 3, 144, '2025-05-28', '10:10:00', '', NULL, NULL, NULL, '2025-05-28 13:10:50', '2025-05-28 13:10:50'),
(10, 2, 40, 2, 116, '2025-05-28', '11:43:00', '', NULL, NULL, NULL, '2025-05-28 14:44:10', '2025-05-28 14:44:10'),
(11, 2, 21, 5, 110, '2025-05-28', '19:17:00', '', NULL, NULL, NULL, '2025-05-28 22:18:05', '2025-05-28 22:18:05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_cama`
--

CREATE TABLE `internacion_cama` (
  `idintercama` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idcama` int(11) DEFAULT NULL,
  `fechadesde` date DEFAULT NULL,
  `fechahasta` date DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `internacion_cama`
--

INSERT INTO `internacion_cama` (`idintercama`, `idinternacion`, `idcama`, `fechadesde`, `fechahasta`, `createdAt`, `updatedAt`) VALUES
(14, 8, 46, '2025-05-28', NULL, '2025-05-28 13:35:21', '2025-05-28 13:35:21'),
(17, 7, 45, '2025-05-28', '2025-05-28', '2025-05-28 14:31:33', '2025-05-28 14:42:48'),
(18, 7, 63, '2025-05-28', NULL, '2025-05-28 14:42:48', '2025-05-28 14:42:48'),
(19, 11, 31, '2025-05-28', NULL, '2025-05-28 22:18:21', '2025-05-28 22:18:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_cirugias`
--

CREATE TABLE `internacion_cirugias` (
  `idintercirugias` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idtipocirugia` int(11) DEFAULT NULL,
  `idmedico` int(11) DEFAULT NULL,
  `fechacirugia` date DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_estudios`
--

CREATE TABLE `internacion_estudios` (
  `idinterestudios` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idmedico` int(11) DEFAULT NULL,
  `idestudio` int(11) DEFAULT NULL,
  `fechaestudio` date DEFAULT NULL,
  `observacioneses` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_evenfermeria`
--

CREATE TABLE `internacion_evenfermeria` (
  `idinterevaluacioenfermeria` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idenfermero` int(11) DEFAULT NULL,
  `fechaevaluacion` date DEFAULT NULL,
  `parterial` varchar(20) DEFAULT NULL,
  `fcardiaca` varchar(20) DEFAULT NULL,
  `frespiratoria` varchar(20) DEFAULT NULL,
  `tcorporal` varchar(20) DEFAULT NULL,
  `saturacion` varchar(20) DEFAULT NULL,
  `observacionesee` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_evmedica`
--

CREATE TABLE `internacion_evmedica` (
  `idinterevaluacionmedica` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idmedico` int(11) DEFAULT NULL,
  `fechaevaluacion` date DEFAULT NULL,
  `iddiagnostico` int(11) DEFAULT NULL,
  `observacionesem` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_medicamentos`
--

CREATE TABLE `internacion_medicamentos` (
  `idintermedicamentos` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idmedico` int(11) DEFAULT NULL,
  `idmedicamento` int(11) DEFAULT NULL,
  `fechaprescripcion` date DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `observacionesme` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `internacion_terapias`
--

CREATE TABLE `internacion_terapias` (
  `idinterterapias` int(11) NOT NULL,
  `idinternacion` int(11) DEFAULT NULL,
  `idmedico` int(11) DEFAULT NULL,
  `fechaterapia` date DEFAULT NULL,
  `idtipoterapia` int(11) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamentos`
--

CREATE TABLE `medicamentos` (
  `idmedicamento` int(11) NOT NULL,
  `nombremedicamento` varchar(100) NOT NULL,
  `presentacion` varchar(100) DEFAULT NULL,
  `idclasificacionterapeutica` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamentos`
--

INSERT INTO `medicamentos` (`idmedicamento`, `nombremedicamento`, `presentacion`, `idclasificacionterapeutica`) VALUES
(1, 'Paracetamol', 'Tabletas 500mg', 1),
(2, 'Ibuprofeno', 'Tabletas 400mg', 2),
(3, 'Amoxicilina', 'Cápsulas 500mg', 3),
(4, 'Omeprazol', 'Cápsulas 20mg', 6),
(5, 'Losartán', 'Tabletas 50mg', 6),
(6, 'Metformina', 'Tabletas 850mg', 7),
(7, 'Atorvastatina', 'Tabletas 20mg', 6),
(8, 'Salbutamol', 'Inhalador', 9),
(9, 'Dexametasona', 'Inyección 4mg/ml', 10),
(10, 'Warfarina', 'Tabletas 5mg', 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicos`
--

CREATE TABLE `medicos` (
  `idmedico` int(11) NOT NULL,
  `apellidonombres` varchar(100) NOT NULL,
  `matricula` varchar(50) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `idespecialidad` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicos`
--

INSERT INTO `medicos` (`idmedico`, `apellidonombres`, `matricula`, `telefono`, `email`, `idespecialidad`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Pérez Juan', '1001', '3511234567', 'juan.perez@example.com', 5, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(2, 'López María', '1002', '3517654321', 'maria.lopez@example.com', 12, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(3, 'Gómez Carlos', '1003', '3511112233', 'carlos.gomez@example.com', 7, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(4, 'Rodríguez Ana', '1004', '3512223344', 'ana.rodriguez@example.com', 14, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(5, 'Sánchez Pedro', '1005', '3513334455', 'pedro.sanchez@example.com', 22, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(6, 'Martínez Laura', '1006', '3514445566', 'laura.martinez@example.com', 9, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(7, 'Ramírez Martín', '1007', '3515556677', 'martin.ramirez@example.com', 3, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(8, 'Torres Lucía', '1008', '3516667788', 'lucia.torres@example.com', 30, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(9, 'Fernández Diego', '1009', '3517778899', 'diego.fernandez@example.com', 18, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(10, 'Herrera Sofía', '1010', '3518889900', 'sofia.herrera@example.com', 27, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(11, 'Castro Gabriel', '1011', '3511122334', 'gabriel.castro@example.com', 11, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(12, 'Vega Florencia', '1012', '3512233445', 'florencia.vega@example.com', 33, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(13, 'Díaz Nicolás', '1013', '3513344556', 'nicolas.diaz@example.com', 1, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(14, 'Ruiz Camila', '1014', '3514455667', 'camila.ruiz@example.com', 6, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(15, 'Navarro Julián', '1015', '3515566778', 'julian.navarro@example.com', 16, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(16, 'Méndez Valentina', '1016', '3516677889', 'valentina.mendez@example.com', 8, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(17, 'Aguirre Matías', '1017', '3517788990', 'matias.aguirre@example.com', 36, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(18, 'Romero Carla', '1018', '3518899001', 'carla.romero@example.com', 24, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(19, 'Molina Facundo', '1019', '3519900112', 'facundo.molina@example.com', 39, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(20, 'Ibáñez Julieta', '1020', '3510011223', 'julieta.ibanez@example.com', 21, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(21, 'Arias Emilio', '1021', '3511133445', 'emilio.arias@example.com', 13, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(22, 'Bustos Martina', '1022', '3512244556', 'martina.bustos@example.com', 10, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(23, 'Sosa Tomás', '1023', '3513355667', 'tomas.sosa@example.com', 4, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(24, 'Paredes Renata', '1024', '3514466778', 'renata.paredes@example.com', 15, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(25, 'Salas Sebastián', '1025', '3515577889', 'sebastian.salas@example.com', 19, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(26, 'Leiva Agustina', '1026', '3516688990', 'agustina.leiva@example.com', 25, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(27, 'Luna Andrés', '1027', '3517799001', 'andres.luna@example.com', 2, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(28, 'Rivero Malena', '1028', '3518800112', 'malena.rivero@example.com', 17, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(29, 'Pinto Federico', '1029', '3519911223', 'federico.pinto@example.com', 26, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(30, 'Núñez Josefina', '1030', '3510022334', 'josefina.nunez@example.com', 32, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(31, 'Correa Rodrigo', '1031', '3511133556', 'rodrigo.correa@example.com', 28, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(32, 'Silva Bianca', '1032', '3512244667', 'bianca.silva@example.com', 20, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(33, 'Muñoz Axel', '1033', '3513355778', 'axel.munoz@example.com', 23, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(34, 'Medina Ariana', '1034', '3514466889', 'ariana.medina@example.com', 34, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(35, 'Ortega Gonzalo', '1035', '3515577990', 'gonzalo.ortega@example.com', 29, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(36, 'Serrano Paulina', '1036', '3516688001', 'paulina.serrano@example.com', 35, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(37, 'Barrios Leandro', '1037', '3517799112', 'leandro.barrios@example.com', 38, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(38, 'Benítez Milagros', '1038', '3518800223', 'milagros.benitez@example.com', 37, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(39, 'Acosta Maximiliano', '1039', '3519911334', 'maxi.acosta@example.com', 31, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(40, 'Escobar Candela', '1040', '3510022445', 'candela.escobar@example.com', 39, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(41, 'Palacios Esteban', '1041', '3511133667', 'esteban.palacios@example.com', 12, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(42, 'Godoy Daiana', '1042', '3512244778', 'daiana.godoy@example.com', 6, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(43, 'Ledesma Lisandro', '1043', '3513355889', 'lisandro.ledesma@example.com', 3, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(44, 'Villalba Abril', '1044', '3514466990', 'abril.villalba@example.com', 11, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(45, 'Bravo Santiago', '1045', '3515577001', 'santiago.bravo@example.com', 13, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(46, 'Olmedo Ailén', '1046', '3516688112', 'ailen.olmedo@example.com', 10, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(47, 'Domínguez Ezequiel', '1047', '3517799223', 'ezequiel.dominguez@example.com', 19, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(48, 'Giménez Sol', '1048', '3518800334', 'sol.gimenez@example.com', 30, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(49, 'Ríos Franco', '1049', '3519911445', 'franco.rios@example.com', 8, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(50, 'Franco Camila', '1050', '3510022556', 'camila.franco@example.com', 5, '2025-05-21 09:36:24', '2025-06-02 20:06:46', NULL),
(55, 'LOPEZ', '255', NULL, NULL, 5, '2025-05-26 15:03:52', '2025-05-26 12:24:37', NULL),
(59, 'PEDRO LORENZO', '256', NULL, NULL, 39, '2025-05-26 15:41:40', '2025-06-02 20:06:46', NULL),
(60, 'MATIRAS', '544', '3213', NULL, 36, '2025-05-26 16:30:18', '2025-05-26 16:30:18', NULL),
(61, 'LOPEZ PEDRO', '125', '2664484134', NULL, 34, '2025-05-27 13:22:44', '2025-06-02 20:06:46', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `origenes`
--

CREATE TABLE `origenes` (
  `idorigen` int(11) NOT NULL,
  `denominacion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `origenes`
--

INSERT INTO `origenes` (`idorigen`, `denominacion`) VALUES
(1, 'Orden de Internación Externa'),
(2, 'Derivación Programada'),
(3, 'Urgencia/Emergencia'),
(4, 'Interconsulta Hospitalaria'),
(5, 'Reinternación'),
(6, 'Traslado desde otra Institución'),
(7, 'Internación Domiciliaria'),
(8, 'Orden Judicial'),
(9, 'Protocolo de Investigación');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `idpaciente` int(11) NOT NULL,
  `apellidonombres` varchar(100) NOT NULL,
  `documento` varchar(20) DEFAULT NULL,
  `fechanacimiento` date DEFAULT NULL,
  `sexo` char(1) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fecharegistro` date DEFAULT NULL,
  `idcobertura` int(11) DEFAULT NULL,
  `contactoemergencia` varchar(255) DEFAULT NULL,
  `fechafallecimiento` date DEFAULT NULL,
  `actadefuncion` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`idpaciente`, `apellidonombres`, `documento`, `fechanacimiento`, `sexo`, `direccion`, `telefono`, `email`, `fecharegistro`, `idcobertura`, `contactoemergencia`, `fechafallecimiento`, `actadefuncion`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'GARCIA MANUEL FACUNDO', '28399283', '1980-12-14', 'M', NULL, NULL, NULL, NULL, 7, NULL, NULL, NULL, '2025-05-21 12:32:37', '2025-05-21 12:32:37', NULL),
(2, 'QUIROGA ROXANA', '24299754', '1975-06-07', 'F', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-05-23 14:58:59', '2025-05-23 14:58:59', NULL),
(3, 'GARCIA IVAN', '39993636', '1997-01-26', 'M', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-05-23 14:59:15', '2025-05-23 14:59:15', NULL),
(4, 'GARCIA CANDELA ABRIL', '44752747', '1980-12-14', 'F', NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, '2025-05-26 12:34:31', '2025-05-26 12:34:31', NULL),
(5, 'PEREZ PLAZA MANUEL', '93030101', '1975-02-09', 'M', NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, '2025-05-28 13:36:09', '2025-05-28 13:36:09', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idrol` int(11) NOT NULL,
  `nombrerol` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idrol`, `nombrerol`) VALUES
(1, 'Administrador'),
(2, 'Médico'),
(3, 'Enfermero'),
(4, 'Recepcionista'),
(5, 'Técnico'),
(6, 'Director'),
(7, 'Auditor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipocirugias`
--

CREATE TABLE `tipocirugias` (
  `idtipocirugia` int(11) NOT NULL,
  `denominacioncirugia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipoterapias`
--

CREATE TABLE `tipoterapias` (
  `idtipoterapia` int(11) NOT NULL,
  `denominacionterapia` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idusuario` int(11) NOT NULL,
  `aliasusuario` varchar(100) DEFAULT NULL,
  `apellidonombres` varchar(100) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idusuario`, `aliasusuario`, `apellidonombres`, `pass`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'admin', 'Administrador del Sistema', '1', '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL),
(2, 'jperez', 'Juan Pérez', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL),
(3, 'mgomez', 'María Gómez', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL),
(4, 'lrodriguez', 'Laura Rodríguez', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_roles`
--

CREATE TABLE `usuarios_roles` (
  `idusuariosroles` int(11) NOT NULL,
  `idusuario` int(11) DEFAULT NULL,
  `idrol` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios_roles`
--

INSERT INTO `usuarios_roles` (`idusuariosroles`, `idusuario`, `idrol`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 1, 1, '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL),
(2, 2, 2, '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL),
(3, 3, 3, '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL),
(4, 4, 4, '2025-05-21 09:10:06', '2025-05-21 09:10:06', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clasificacion_terapeutica`
--
ALTER TABLE `clasificacion_terapeutica`
  ADD PRIMARY KEY (`idclasificacionterapeutica`),
  ADD UNIQUE KEY `denominacion` (`denominacion`),
  ADD KEY `denominacion_2` (`denominacion`),
  ADD KEY `idx_denominacion` (`denominacion`);

--
-- Indices de la tabla `coberturas`
--
ALTER TABLE `coberturas`
  ADD PRIMARY KEY (`idcobertura`),
  ADD UNIQUE KEY `denominacion` (`denominacion`),
  ADD KEY `denominacion_2` (`denominacion`);

--
-- Indices de la tabla `diagnosticos`
--
ALTER TABLE `diagnosticos`
  ADD PRIMARY KEY (`iddiagnostico`),
  ADD UNIQUE KEY `codigo` (`codigo`),
  ADD UNIQUE KEY `descripcion` (`descripcion`),
  ADD KEY `codigo_2` (`codigo`),
  ADD KEY `diagnosticos_codigo` (`codigo`);

--
-- Indices de la tabla `enfermeros`
--
ALTER TABLE `enfermeros`
  ADD PRIMARY KEY (`idenfermero`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD UNIQUE KEY `idx_matricula` (`matricula`),
  ADD KEY `apellidonombres` (`apellidonombres`),
  ADD KEY `idx_apellidonombres` (`apellidonombres`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`idespecialidad`),
  ADD UNIQUE KEY `denominacion` (`denominacion`),
  ADD KEY `denominacion_2` (`denominacion`);

--
-- Indices de la tabla `estudios`
--
ALTER TABLE `estudios`
  ADD PRIMARY KEY (`idestudio`),
  ADD UNIQUE KEY `denominacion` (`denominacion`),
  ADD KEY `denominacion_2` (`denominacion`);

--
-- Indices de la tabla `infra_alas`
--
ALTER TABLE `infra_alas`
  ADD PRIMARY KEY (`idala`),
  ADD UNIQUE KEY `denominacion` (`denominacion`);

--
-- Indices de la tabla `infra_camas`
--
ALTER TABLE `infra_camas`
  ADD PRIMARY KEY (`idcama`),
  ADD UNIQUE KEY `idhabitacion` (`idhabitacion`,`numerocama`),
  ADD UNIQUE KEY `infra_camas_idhabitacion_numerocama` (`idhabitacion`,`numerocama`);

--
-- Indices de la tabla `infra_habitaciones`
--
ALTER TABLE `infra_habitaciones`
  ADD PRIMARY KEY (`idhabitacion`),
  ADD KEY `idunidad` (`idunidad`),
  ADD KEY `idala` (`idala`);

--
-- Indices de la tabla `infra_unidades`
--
ALTER TABLE `infra_unidades`
  ADD PRIMARY KEY (`idunidad`),
  ADD UNIQUE KEY `denominacion` (`denominacion`);

--
-- Indices de la tabla `internacion`
--
ALTER TABLE `internacion`
  ADD PRIMARY KEY (`idinternacion`),
  ADD KEY `idorigen` (`idorigen`),
  ADD KEY `idmedico` (`idmedico`),
  ADD KEY `idpaciente` (`idpaciente`),
  ADD KEY `iddiagnostico` (`iddiagnostico`),
  ADD KEY `idmedicoalta` (`idmedicoalta`);

--
-- Indices de la tabla `internacion_cama`
--
ALTER TABLE `internacion_cama`
  ADD PRIMARY KEY (`idintercama`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idcama` (`idcama`);

--
-- Indices de la tabla `internacion_cirugias`
--
ALTER TABLE `internacion_cirugias`
  ADD PRIMARY KEY (`idintercirugias`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idmedico` (`idmedico`),
  ADD KEY `idtipocirugia` (`idtipocirugia`);

--
-- Indices de la tabla `internacion_estudios`
--
ALTER TABLE `internacion_estudios`
  ADD PRIMARY KEY (`idinterestudios`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idmedico` (`idmedico`),
  ADD KEY `idestudio` (`idestudio`);

--
-- Indices de la tabla `internacion_evenfermeria`
--
ALTER TABLE `internacion_evenfermeria`
  ADD PRIMARY KEY (`idinterevaluacioenfermeria`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idenfermero` (`idenfermero`);

--
-- Indices de la tabla `internacion_evmedica`
--
ALTER TABLE `internacion_evmedica`
  ADD PRIMARY KEY (`idinterevaluacionmedica`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idmedico` (`idmedico`),
  ADD KEY `iddiagnostico` (`iddiagnostico`);

--
-- Indices de la tabla `internacion_medicamentos`
--
ALTER TABLE `internacion_medicamentos`
  ADD PRIMARY KEY (`idintermedicamentos`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idmedico` (`idmedico`),
  ADD KEY `idmedicamento` (`idmedicamento`);

--
-- Indices de la tabla `internacion_terapias`
--
ALTER TABLE `internacion_terapias`
  ADD PRIMARY KEY (`idinterterapias`),
  ADD KEY `idinternacion` (`idinternacion`),
  ADD KEY `idmedico` (`idmedico`),
  ADD KEY `idtipoterapia` (`idtipoterapia`);

--
-- Indices de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD PRIMARY KEY (`idmedicamento`),
  ADD UNIQUE KEY `nombremedicamento` (`nombremedicamento`),
  ADD KEY `idclasificacionterapeutica` (`idclasificacionterapeutica`),
  ADD KEY `nombremedicamento_2` (`nombremedicamento`);

--
-- Indices de la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD PRIMARY KEY (`idmedico`),
  ADD UNIQUE KEY `matricula` (`matricula`),
  ADD KEY `idespecialidad` (`idespecialidad`),
  ADD KEY `apellidonombres` (`apellidonombres`);

--
-- Indices de la tabla `origenes`
--
ALTER TABLE `origenes`
  ADD PRIMARY KEY (`idorigen`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`idpaciente`),
  ADD UNIQUE KEY `documento` (`documento`),
  ADD UNIQUE KEY `pacientes_documento` (`documento`),
  ADD KEY `idcobertura` (`idcobertura`),
  ADD KEY `apellidonombres` (`apellidonombres`),
  ADD KEY `pacientes_apellidonombres` (`apellidonombres`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idrol`);

--
-- Indices de la tabla `tipocirugias`
--
ALTER TABLE `tipocirugias`
  ADD PRIMARY KEY (`idtipocirugia`),
  ADD UNIQUE KEY `denominacioncirugia` (`denominacioncirugia`);

--
-- Indices de la tabla `tipoterapias`
--
ALTER TABLE `tipoterapias`
  ADD PRIMARY KEY (`idtipoterapia`),
  ADD UNIQUE KEY `denominacionterapia` (`denominacionterapia`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idusuario`);

--
-- Indices de la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD PRIMARY KEY (`idusuariosroles`),
  ADD KEY `idusuario` (`idusuario`),
  ADD KEY `idrol` (`idrol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `clasificacion_terapeutica`
--
ALTER TABLE `clasificacion_terapeutica`
  MODIFY `idclasificacionterapeutica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `coberturas`
--
ALTER TABLE `coberturas`
  MODIFY `idcobertura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `diagnosticos`
--
ALTER TABLE `diagnosticos`
  MODIFY `iddiagnostico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT de la tabla `enfermeros`
--
ALTER TABLE `enfermeros`
  MODIFY `idenfermero` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `idespecialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `estudios`
--
ALTER TABLE `estudios`
  MODIFY `idestudio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `infra_alas`
--
ALTER TABLE `infra_alas`
  MODIFY `idala` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `infra_camas`
--
ALTER TABLE `infra_camas`
  MODIFY `idcama` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT de la tabla `infra_habitaciones`
--
ALTER TABLE `infra_habitaciones`
  MODIFY `idhabitacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `infra_unidades`
--
ALTER TABLE `infra_unidades`
  MODIFY `idunidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `internacion`
--
ALTER TABLE `internacion`
  MODIFY `idinternacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `internacion_cama`
--
ALTER TABLE `internacion_cama`
  MODIFY `idintercama` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `internacion_cirugias`
--
ALTER TABLE `internacion_cirugias`
  MODIFY `idintercirugias` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `internacion_estudios`
--
ALTER TABLE `internacion_estudios`
  MODIFY `idinterestudios` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `internacion_evenfermeria`
--
ALTER TABLE `internacion_evenfermeria`
  MODIFY `idinterevaluacioenfermeria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `internacion_evmedica`
--
ALTER TABLE `internacion_evmedica`
  MODIFY `idinterevaluacionmedica` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `internacion_medicamentos`
--
ALTER TABLE `internacion_medicamentos`
  MODIFY `idintermedicamentos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `internacion_terapias`
--
ALTER TABLE `internacion_terapias`
  MODIFY `idinterterapias` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  MODIFY `idmedicamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `medicos`
--
ALTER TABLE `medicos`
  MODIFY `idmedico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `origenes`
--
ALTER TABLE `origenes`
  MODIFY `idorigen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `idpaciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idrol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tipocirugias`
--
ALTER TABLE `tipocirugias`
  MODIFY `idtipocirugia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipoterapias`
--
ALTER TABLE `tipoterapias`
  MODIFY `idtipoterapia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idusuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  MODIFY `idusuariosroles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `infra_camas`
--
ALTER TABLE `infra_camas`
  ADD CONSTRAINT `infra_camas_ibfk_1` FOREIGN KEY (`idhabitacion`) REFERENCES `infra_habitaciones` (`idhabitacion`);

--
-- Filtros para la tabla `infra_habitaciones`
--
ALTER TABLE `infra_habitaciones`
  ADD CONSTRAINT `infra_habitaciones_ibfk_1` FOREIGN KEY (`idunidad`) REFERENCES `infra_unidades` (`idunidad`),
  ADD CONSTRAINT `infra_habitaciones_ibfk_2` FOREIGN KEY (`idala`) REFERENCES `infra_alas` (`idala`);

--
-- Filtros para la tabla `internacion`
--
ALTER TABLE `internacion`
  ADD CONSTRAINT `internacion_ibfk_1` FOREIGN KEY (`idorigen`) REFERENCES `origenes` (`idorigen`),
  ADD CONSTRAINT `internacion_ibfk_2` FOREIGN KEY (`idmedico`) REFERENCES `medicos` (`idmedico`),
  ADD CONSTRAINT `internacion_ibfk_3` FOREIGN KEY (`idpaciente`) REFERENCES `pacientes` (`idpaciente`),
  ADD CONSTRAINT `internacion_ibfk_4` FOREIGN KEY (`iddiagnostico`) REFERENCES `diagnosticos` (`iddiagnostico`),
  ADD CONSTRAINT `internacion_ibfk_5` FOREIGN KEY (`idmedicoalta`) REFERENCES `medicos` (`idmedico`);

--
-- Filtros para la tabla `internacion_cama`
--
ALTER TABLE `internacion_cama`
  ADD CONSTRAINT `internacion_cama_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_cama_ibfk_2` FOREIGN KEY (`idcama`) REFERENCES `infra_camas` (`idcama`);

--
-- Filtros para la tabla `internacion_cirugias`
--
ALTER TABLE `internacion_cirugias`
  ADD CONSTRAINT `internacion_cirugias_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_cirugias_ibfk_2` FOREIGN KEY (`idmedico`) REFERENCES `medicos` (`idmedico`),
  ADD CONSTRAINT `internacion_cirugias_ibfk_3` FOREIGN KEY (`idtipocirugia`) REFERENCES `tipocirugias` (`idtipocirugia`);

--
-- Filtros para la tabla `internacion_estudios`
--
ALTER TABLE `internacion_estudios`
  ADD CONSTRAINT `internacion_estudios_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_estudios_ibfk_2` FOREIGN KEY (`idmedico`) REFERENCES `medicos` (`idmedico`),
  ADD CONSTRAINT `internacion_estudios_ibfk_3` FOREIGN KEY (`idestudio`) REFERENCES `estudios` (`idestudio`);

--
-- Filtros para la tabla `internacion_evenfermeria`
--
ALTER TABLE `internacion_evenfermeria`
  ADD CONSTRAINT `internacion_evenfermeria_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_evenfermeria_ibfk_2` FOREIGN KEY (`idenfermero`) REFERENCES `enfermeros` (`idenfermero`);

--
-- Filtros para la tabla `internacion_evmedica`
--
ALTER TABLE `internacion_evmedica`
  ADD CONSTRAINT `internacion_evmedica_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_evmedica_ibfk_2` FOREIGN KEY (`idmedico`) REFERENCES `medicos` (`idmedico`),
  ADD CONSTRAINT `internacion_evmedica_ibfk_3` FOREIGN KEY (`iddiagnostico`) REFERENCES `diagnosticos` (`iddiagnostico`);

--
-- Filtros para la tabla `internacion_medicamentos`
--
ALTER TABLE `internacion_medicamentos`
  ADD CONSTRAINT `internacion_medicamentos_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_medicamentos_ibfk_2` FOREIGN KEY (`idmedico`) REFERENCES `medicos` (`idmedico`),
  ADD CONSTRAINT `internacion_medicamentos_ibfk_3` FOREIGN KEY (`idmedicamento`) REFERENCES `medicamentos` (`idmedicamento`);

--
-- Filtros para la tabla `internacion_terapias`
--
ALTER TABLE `internacion_terapias`
  ADD CONSTRAINT `internacion_terapias_ibfk_1` FOREIGN KEY (`idinternacion`) REFERENCES `internacion` (`idinternacion`),
  ADD CONSTRAINT `internacion_terapias_ibfk_2` FOREIGN KEY (`idmedico`) REFERENCES `medicos` (`idmedico`),
  ADD CONSTRAINT `internacion_terapias_ibfk_3` FOREIGN KEY (`idtipoterapia`) REFERENCES `tipoterapias` (`idtipoterapia`);

--
-- Filtros para la tabla `medicamentos`
--
ALTER TABLE `medicamentos`
  ADD CONSTRAINT `medicamentos_ibfk_1` FOREIGN KEY (`idclasificacionterapeutica`) REFERENCES `clasificacion_terapeutica` (`idclasificacionterapeutica`);

--
-- Filtros para la tabla `medicos`
--
ALTER TABLE `medicos`
  ADD CONSTRAINT `medicos_ibfk_1` FOREIGN KEY (`idespecialidad`) REFERENCES `especialidades` (`idespecialidad`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `pacientes_ibfk_1` FOREIGN KEY (`idcobertura`) REFERENCES `coberturas` (`idcobertura`);

--
-- Filtros para la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD CONSTRAINT `usuarios_roles_ibfk_1` FOREIGN KEY (`idusuario`) REFERENCES `usuarios` (`idusuario`),
  ADD CONSTRAINT `usuarios_roles_ibfk_2` FOREIGN KEY (`idrol`) REFERENCES `roles` (`idrol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

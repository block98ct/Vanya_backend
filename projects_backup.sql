-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: vanya_db
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.22.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `project_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
  `user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `category_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `carbon_credits` double DEFAULT NULL,
  `amount_worth` int DEFAULT NULL,
  `no_tree_planted` int DEFAULT '0',
  `product_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
  `amount_invested_without_tax` int DEFAULT '0',
  `kml_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `geo_json_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `project_desch` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
  `project_para_descp` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `first_image_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `first_image_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `second_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `second_image_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `third_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `third_image_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `area_in_acres` int DEFAULT '0',
  `area_in_hectars` int DEFAULT '0',
  `land_developer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
  `project_header3` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
  `project_para2` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `project_para3` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `project_header4` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '0',
  `projectstory_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gjson_or_kml` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'K' COMMENT 'Value can be K or G',
  `tabs_image_link` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `video_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `latitude` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `longitude` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `ndvi` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `carbon` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `npar` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `par` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'qwertyui','1',40,'2024-06-27 13:34:06','2024-06-27 13:34:06',1000.5,500000,500,'Solar Panel Project',450000,'https://example.com/yourproject.kml','https://example.com/yourproject.geojson','This is a renewable energy project aimed at reducing carbon emissions.','Detailed description of the project, including objectives, benefits, and implementation details.','1719495246698-earthOnHand.jpg','An image showing the initial phase of the project.','1719495246699-treeInHand.jpg','An image showing the progress of the project.','1719495246699-blueEarth.jpg','An image showing the completed project.',100,41,'Green Earth Developers','Key Milestones','The project has achieved several key milestones including approval from environmental agencies.','Future plans include expanding the project to cover more areas and increase carbon offset.','Future Plans','1719495246700-greenEarth.jpg','K','https://example.com/images/tabs_image.jpg','1719495246700-sample_640x360.mp4','New York, USA','0xa3fdf38bfaa830923b4284dc5eb86604e14834b0','20.36','40.58','30','36','5','5'),(2,'qwertyui','1',40,'2024-06-27 13:36:08','2024-06-27 13:36:08',1000.5,500000,500,'Solar Panel Project',450000,'https://example.com/yourproject.kml','https://example.com/yourproject.geojson','This is a renewable energy project aimed at reducing carbon emissions.','Detailed description of the project, including objectives, benefits, and implementation details.','1719495368789-thor.jpg','An image showing the initial phase of the project.','1719495368794-thor.jpg','An image showing the progress of the project.','1719495368799-thor.jpg','An image showing the completed project.',100,41,'Green Earth Developers','Key Milestones','The project has achieved several key milestones including approval from environmental agencies.','Future plans include expanding the project to cover more areas and increase carbon offset.','Future Plans','1719495368802-thor.jpg','K','https://example.com/images/tabs_image.jpg','1719495368804-sample_640x360.mp4','New York, USA','0xa3fdf38bfaa830923b4284dc5eb86604e14834b0','20.36','40.58','30','36','5','5');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-28 12:10:28

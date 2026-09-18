<?php
/**
 * VinilArt Sport Theme Functions and Definitions
 *
 * @package VinilArt_Sport
 * @version 1.0.0
 */

defined( 'ABSPATH' ) || exit;

// Constantes do Tema
define( 'VINILART_SPORT_VERSION', '1.0.0' );
define( 'VINILART_SPORT_DIR', get_template_directory() );
define( 'VINILART_SPORT_URI', get_template_directory_uri() );

/**
 * Carregamento dos ficheiros modulares
 */
require_once VINILART_SPORT_DIR . '/inc/setup.php';
require_once VINILART_SPORT_DIR . '/inc/assets.php';
require_once VINILART_SPORT_DIR . '/inc/routes.php';
require_once VINILART_SPORT_DIR . '/inc/products.php';
require_once VINILART_SPORT_DIR . '/inc/product-meta.php';
require_once VINILART_SPORT_DIR . '/inc/categories.php';
require_once VINILART_SPORT_DIR . '/inc/categories-meta.php';
require_once VINILART_SPORT_DIR . '/inc/register-meta.php';
require_once VINILART_SPORT_DIR . '/inc/admin.php';
require_once VINILART_SPORT_DIR . '/inc/seeder.php';
require_once VINILART_SPORT_DIR . '/inc/rest.php';
require_once VINILART_SPORT_DIR . '/inc/api-endpoints.php';

<?php
/**
 * Fundação de endpoints REST API do tema VinilArt Sport.
 *
 * Namespace: /wp-json/vinilart-sport/v1/
 *
 * @package VinilArt_Sport
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'vinilart_sport_register_rest_routes' ) ) {
	/**
	 * Regista as rotas base da API REST para o tema.
	 */
	function vinilart_sport_register_rest_routes() {
		$namespace = 'vinilart-sport/v1';

		// Endpoint Técnico de Verificação de Estado (Health Check)
		register_rest_route(
			$namespace,
			'/health',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => 'vinilart_sport_rest_health_check',
				'permission_callback' => '__return_true',
			)
		);

		// Endpoint de Configuração Base para Frontend
		register_rest_route(
			$namespace,
			'/config',
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => 'vinilart_sport_rest_get_config',
				'permission_callback' => '__return_true',
			)
		);
	}
}
add_action( 'rest_api_init', 'vinilart_sport_register_rest_routes' );

if ( ! function_exists( 'vinilart_sport_rest_health_check' ) ) {
	/**
	 * Callback para verificação técnica de funcionamento da REST API.
	 *
	 * @param WP_REST_Request $request Objeto do pedido REST.
	 * @return WP_REST_Response Resposta JSON.
	 */
	function vinilart_sport_rest_health_check( $request ) {
		return rest_ensure_response(
			array(
				'status'    => 'ok',
				'theme'     => 'VinilArt Sport',
				'version'   => VINILART_SPORT_VERSION,
				'timestamp' => current_time( 'timestamp' ),
			)
		);
	}
}

if ( ! function_exists( 'vinilart_sport_rest_get_config' ) ) {
	/**
	 * Callback para obter parâmetros e rotas públicas de configuração.
	 *
	 * @param WP_REST_Request $request Objeto do pedido REST.
	 * @return WP_REST_Response Resposta JSON de configuração.
	 */
	function vinilart_sport_rest_get_config( $request ) {
		return rest_ensure_response(
			array(
				'site_name'    => get_bloginfo( 'name' ),
				'currency'     => 'EUR',
				'currency_sym' => '€',
				'version'      => VINILART_SPORT_VERSION,
			)
		);
	}
}
